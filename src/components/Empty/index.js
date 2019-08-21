import Taro, { Component } from '@tarojs/taro';
import PropTypes from 'prop-types';
import { View, Text } from '@tarojs/components';

import './style.less';

export default class Empty extends Component {

  static propTypes = {
    content: PropTypes.string
  };

  static defaultProps = {
    content: '暂无数据...'
  };

  componentWillMount() {
  }

  render() {
    const {content} = this.props;
    return (
      <View className='content'>
        <Text className='text'>{content}</Text>
      </View>
    );
  }
}
