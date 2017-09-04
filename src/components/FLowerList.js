import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Layout, Badge, Icon } from 'antd';

const { Sider } = Layout;

const FlowerList = ({ group, flowers, onSelect }) => {
  if (!Object.keys(group).length) { // prevent empty list
    return null;
  }
  const selectedFlower = flowers.reduce((o, f) => {
    o[f.name] = (f.selected === true);
    return o;
  }, {});

  return (
    <Sider className="FlowerList-sider" width={200}>
      <Menu
        defaultSelectedKeys={[Object.keys(group)[0]]}
        mode="inline"
        onClick={({ key }) => onSelect(key)}
        style={{ height: '100%' }}
      >
        { Object.keys(group).map(groupName => {
          const currentFlower = flowers.find(f => f.name === groupName);
          const imageCount = (currentFlower && currentFlower.images) ? Object.keys(currentFlower.images).length : 0;

          return (
            <Menu.Item key={groupName}>
              <Icon
                className="FlowerList-sider-icon"
                style={{ color: selectedFlower[groupName] ? '#87d068' : '#f04134' }}
                type={ selectedFlower[groupName] ? 'check-square-o' : 'close-square-o' }
              />
              <Badge
                className="FlowerList-sider-badge"
                count={`${imageCount}/${group[groupName].files.length}`}
                style={{ backgroundColor: selectedFlower[groupName] ? '#87d068' : '#f04134' }}
              />
              { groupName }
            </Menu.Item>
          );
        }) }
      </Menu>
    </Sider>
  );
};

FlowerList.__ANT_LAYOUT_SIDER = true;

FlowerList.propTypes = {
  group: PropTypes.shape({
    name: PropTypes.string,
    files: PropTypes.array,
  }),
  flowers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      selected: PropTypes.bool.isRequired,
      images: PropTypes.object,
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default FlowerList;
