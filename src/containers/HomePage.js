import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import Loading from '../components/Loading';
import FlowerList from '../components/FlowerList';
import FlowerForm from '../components/FlowerForm';
import AppLayout from '../components/layouts/AppLayout';
import { userIsAuthenticated } from '../lib/auth';
import * as s3Actions from '../actions/s3Actions';
import {
  firebaseConnect,
  isLoaded,
  isEmpty,
  dataToJS,
  pathToJS,
} from 'react-redux-firebase';

const { Content } = Layout;

@firebaseConnect([ '/flowers' ])
@connect(({ firebase, rootReducer: { s3: { results: fileList, errorMessage } } }) => {
  const flowers = dataToJS(firebase, 'flowers');
  let flowerGroup = fileList;

  if (isLoaded(flowers) && !isEmpty(flowers)) {
    flowerGroup = flowerGroup.sort((a, b) => {
      const af = flowers[a.name] || null;
      const bf = flowers[b.name] || null;
      const sa = (af && af.selected) ? 1 : 0;
      const sb = (bf && bf.selected) ? 1 : 0;
      return (sb - sa);
    });
  }

  flowerGroup = flowerGroup.reduce((g, f) => {
    if (!g[f.name]) {
      g[f.name] = {
        name: f.name,
        files: []
      };
    }
    g[f.name].files.push(f);
    return g;
  }, {});

  return {
    flowers,
    profile: pathToJS(firebase, 'profile'),
    fileList,
    flowerGroup,
    s3Error: errorMessage,
  };
}, dispatch => ({
  s3Actions: bindActionCreators(s3Actions, dispatch)
}))
@userIsAuthenticated
export default class HomePage extends Component {
  static propTypes = {
    flowers: PropTypes.object,
    profile: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      avatarUrl: PropTypes.string.isRequired,
    }).isRequired,
    flowerGroup: PropTypes.object,
    s3Error: PropTypes.string,
    fileList: PropTypes.array,
    s3Actions: PropTypes.shape({
      getFileList: PropTypes.func.isRequired,
    }).isRequired,
    firebase: PropTypes.shape({
      push: PropTypes.func.isRequired,
      remove: PropTypes.func.isRequired,
      update: PropTypes.func.isRequired,
    }),
  }

  constructor (props) {
    super(props);

    this.timer = 0;
    this.state = {
      selected: '',
      loading: true,
    };
    this.props.s3Actions.getFileList().then(() =>
      this.setState({ loading: false })
    );
  }

  componentWillReceiveProps ({ flowerGroup }) {
    if (!this.state.selected && Object.keys(flowerGroup).length) {
      this.setState({
        selected: Object.keys(flowerGroup)[0]
      });
    }
  }

  handleSelect (index) {
    this.setState({ selected: index });
  }

  handleFlowerImageUpdate (image) {
    const flowerName = this.state.selected;

    // update the flower name everytime, in case ths flower isn't exists in database
    this.props.firebase.update(`/flowers/${flowerName}`, {
      name: flowerName,
    }).then(() =>
      this.props.firebase.update(`/flowers/${flowerName}/images/${image.id}`, image)
    );
  }

  render () {
    if (this.state.loading) {
      return (<Loading/>);
    }

    const { profile, flowerGroup, flowers } = this.props;
    const flowerList = isEmpty(flowers) ?
      [] :
      Object.keys(flowers)
        .map(key => Object.assign({}, flowers[key], { name: key }));
    const selectedItem = (flowers && flowers.hasOwnProperty(this.state.selected)) ? flowers[this.state.selected] : {};
    const selectImages = flowerGroup.hasOwnProperty(this.state.selected) ? flowerGroup[this.state.selected].files : [];

    return (
      <AppLayout profile={ profile }>
        <Layout className="HomePage">
          <FlowerList
            flowers={flowerList}
            group={flowerGroup}
            isLoaded={isLoaded(flowers)}
            onSelect={this.handleSelect.bind(this)}
          />
          <Content className="HomePage-content">
            <h1>{ this.state.selected }</h1>
            <hr/>
            <FlowerForm
              images={selectImages}
              item={selectedItem}
              onUpdate={this.handleFlowerImageUpdate.bind(this)}
            />
          </Content>
        </Layout>
      </AppLayout>
    );
  }
}
