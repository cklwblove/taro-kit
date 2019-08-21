import '@tarojs/async-await';
import Taro, { Component } from '@tarojs/taro';
import { Provider } from '@tarojs/redux';
import Index from './pages/index';

import configStore from './store';

import './app.less';

const store = configStore;

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/me/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      borderStyle: 'black',
      selectedColor: '#000000',
      backgroundColor: '#ffffff',
      color: '#c7c7c7',
      list: [
        {
          pagePath: 'pages/index/index',
          selectedIconPath: './assets/img/tab/discover@highlight.png',
          iconPath: './assets/img/tab/discover.png',
          text: '发现'
        },
        {
          pagePath: 'pages/me/index',
          selectedIconPath: './assets/img/tab/my@highlight.png',
          iconPath: './assets/img/tab/my.png',
          text: '我'
        }
      ]
    }
  };

  componentDidMount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  componentCatchError() {
  }

  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById('app'));
