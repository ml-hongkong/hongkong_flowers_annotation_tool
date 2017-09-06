import { createAction } from 'redux-actions';

const S3_SUCCESS = 'S3_SUCCESS';
const S3_FAILED = 'S3_FAILED';
const S3_BASE_URL = 'https://dlhk-flower-app.s3.amazonaws.com';

const getBucketList = (continuationToken = '', previousList = []) =>
  fetch(continuationToken ?
    S3_BASE_URL + '?list-type=2&continuation-token=' + encodeURIComponent(continuationToken) :
    S3_BASE_URL + '?list-type=2'
  )
    .then((res) => res.text())
    .then(xml => (new window.DOMParser()).parseFromString(xml, 'text/xml'))
    .then(doc => {
      const nextContinuationTokenDom = doc.querySelector('NextContinuationToken');
      const nextContinuationToken = nextContinuationTokenDom ? nextContinuationTokenDom.textContent : '';
      const isTruncated = doc.querySelector('IsTruncated').textContent;
      const list = previousList.concat(
        Array.from(doc.querySelectorAll('ListBucketResult Contents Key'))
          .map(key => key.innerHTML)
          .filter(name => /\.jpg$/.test(name))
          .map(filePath => {
            const key = filePath.replace(/^dataset\//, '');
            const [name, imgId] = key.split('/');

            return {
              id: imgId.split('.jpg')[0],
              name,
              url: `${S3_BASE_URL}/${filePath}`,
            };
          })
      );

      if (isTruncated && nextContinuationToken) {
        return getBucketList(nextContinuationToken, list);
      }

      return list;
    });

export const s3Success = createAction(S3_SUCCESS, res => ({
  results: res, errorMessage: ''
}));

export const s3Failed = createAction(S3_FAILED, errorMessage => ({
  results: [], errorMessage
}));

export const getFileList = () => dispatch =>
  getBucketList()
    .then(data => dispatch(s3Success(data)))
    .catch(ex => dispatch(s3Failed(ex.message)));
