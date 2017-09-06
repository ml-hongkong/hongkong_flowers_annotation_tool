import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Card, Checkbox, Modal } from 'antd';
import ReactCrop from 'react-image-crop';

require('react-image-crop/dist/ReactCrop.css');

const gridStyle = {
  width: '20%',
  textAlign: 'center',
};

class FlowerForm extends Component {
  static propTypes = {
    images: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }).isRequired
    ).isRequired,
    item: PropTypes.shape({
      name: PropTypes.string,
      selected: PropTypes.bool,
      images: PropTypes.shape({
        id: PropTypes.string,
        selected: PropTypes.bool,
        crop: PropTypes.object,
        url: PropTypes.string,
      }),
    }),
    onUpdate: PropTypes.func.isRequired,
    onSelected: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);

    this.state = {
      showImageModel: false,
      selectImage: null,
      imageSelected: {},
      imageCrops: {},
    };
  }

  componentWillReceiveProps ({ item }) {
    const itemImageArr = item.images ? Object.keys(item.images).map(key => item.images[key]) : [];
    const { imageSelected, imageCrops } = this.state;

    this.setState({
      imageSelected: Object.keys(imageSelected) ? itemImageArr.reduce((o, img) => {
        o[img.id] = img.selected;
        return o;
      }, {}) : {},
      imageCrops: Object.keys(imageCrops) ? itemImageArr.reduce((o, img) => {
        o[img.id] = img.crop;
        return o;
      }, {}) : {},
    });
  }

  openImageModel (image) {
    return () => {
      this.setState({
        showImageModel: true,
        selectImage: image
      });
    };
  }

  closeImageModel () {
    this.setState({ showImageModel: false });
  }

  handleImageEdit () {
    const { selectImage, imageSelected, imageCrops } = this.state;

    this.setState({ showImageModel: false });
    this.props.onUpdate({
      id: selectImage.id,
      selected: (imageSelected[selectImage.id] === true),
      crop: imageCrops[selectImage.id],
      url: selectImage.url,
    });
  }

  handleCropComplete (crop) {
    const { imageCrops, selectImage } = this.state;
    imageCrops[selectImage.id] = crop;
    this.setState({ imageCrops });
  }

  renderImageModel () {
    const { selectImage, imageSelected } = this.state;
    const selectImageCrop = selectImage ?
      Object.assign(this.state.imageCrops[selectImage.id] || {}, { aspect: 1 }) :
      { aspect: 1 };

    return selectImage ? (
      <Modal
        cancelText="Cancel"
        okText="Confrim"
        onCancel={this.closeImageModel.bind(this)}
        onOk={this.handleImageEdit.bind(this)}
        title={selectImage.id}
        visible={this.state.showImageModel}
      >
        <Checkbox
          checked={imageSelected[selectImage.id]}
          className="FlowerForm-image-modal-selected"
          onChange={e => {
            imageSelected[selectImage.id] = e.target.checked;
            this.setState({ imageSelected });
          }}
        >
          <b>Select this image</b>
        </Checkbox>
        <br/>
        <ReactCrop
          crop={selectImageCrop}
          key={selectImage.id}
          onComplete={this.handleCropComplete.bind(this)}
          src={selectImage.url}
        />
      </Modal>
    ) : null;
  }

  render () {
    const { images, item, onSelected } = this.props;
    const { imageSelected } = this.state;

    return (
      <Layout className="FlowerForm">
        <Checkbox
          checked={item.selected}
          className="FlowerForm-selected"
          onChange={e => onSelected(e.target.checked)}
        >
          <b>Add to dataset</b>
        </Checkbox>
        <Card className="FlowerForm-images" noHovering title="Images">
          { images.sort((a, b) => (b.id > a.id) ? 1 : -1).map((image, key) => (
            <Card.Grid className="FlowerForm-images-card" key={key} style={gridStyle}>
              <a className="FlowerForm-images-card-link" onClick={this.openImageModel(image).bind(this)}>
                {
                  <div
                    className="FlowerForm-images-card-image"
                    style={{ backgroundImage: `url(${encodeURI(image.url)})` }}
                  />
                }
                <div
                  className="FlowerForm-images-card-body"
                  style={imageSelected[image.id] ? { backgroundColor: '#87d068' } : {}}
                >
                  <h3 style={imageSelected[image.id] ? { color: 'white' } : {}}>{ image.id }</h3>
                </div>
              </a>
            </Card.Grid>
          )) }
        </Card>
        { this.renderImageModel() }
      </Layout>
    );
  }
}

export default FlowerForm;
