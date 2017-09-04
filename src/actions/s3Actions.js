import { createAction } from 'redux-actions';

const S3_SUCCESS = 'S3_SUCCESS';
const S3_FAILED = 'S3_FAILED';

export const s3Success = createAction(S3_SUCCESS, res => ({
  results: res, errorMessage: ''
}));

export const s3Failed = createAction(S3_FAILED, errorMessage => ({
  results: [], errorMessage
}));

export const getFileList = () => dispatch => {
  const baseUrl = 'https://dlhk-flower-app.s3.amazonaws.com';

  return fetch(baseUrl)
    .then((res) => res.text())
    .then(xml => (new window.DOMParser()).parseFromString(xml, 'text/xml'))
    .then((data) =>
      dispatch(
        s3Success(
          Array.from(data.querySelectorAll('ListBucketResult Contents Key'))
            .map(key => key.innerHTML)
            .filter(name => /\.jpg$/.test(name))
            .map(filePath => {
              const key = filePath.replace(/^dataset\//, '');
              const [name, imgId] = key.split('/');

              return {
                id: imgId.split('.jpg')[0],
                name,
                url: `${baseUrl}/${filePath}`,
              };
            })
        )
      )
    )
    .catch(ex => dispatch(s3Failed(ex.message)));
};
