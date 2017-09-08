import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Layout, Badge } from 'antd';

const { Sider } = Layout;

const FlowerList = ({ group, flowers, onSelect }) => {
  if (!Object.keys(group).length) { // prevent empty list
    return null;
  }

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
          const imageCount = (currentFlower && currentFlower.images) ?
            Object.keys(currentFlower.images)
              .filter(key => currentFlower.images[key].selected).length :
            0;

          return (
            <Menu.Item key={groupName}>
              <Badge
                className="FlowerList-sider-badge"
                count={`${imageCount}/${group[groupName].files.length}`}
                style={{ backgroundColor: imageCount > 0 ? '#87d068' : '#f04134' }}
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
      name: PropTypes.string,
      selected: PropTypes.bool,
      images: PropTypes.object,
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default FlowerList;
