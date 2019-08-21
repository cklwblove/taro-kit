import Taro from '@tarojs/taro';
import { HTTP_STATUS, CODE_MESSAGE } from '@/constants/status';
import { baseUrl } from './config';
import { logError } from '@/utils';

// 检测请求状态
const checkStatusAndFilter = (response) => {
  if (response.statusCode >= 200 && response.statusCode < 300) {
    if (response.statusCode === 200 || response.statusCode === 304) {
      return response.data;
    }
    return response;
  }
  // 除此之外的错所有遍历上面的错误信息抛出异常
  const errorText = CODE_MESSAGE[response.statusCode] || response.errMsg;

  Taro.showToast({
    title: errorText,
    mask: true,
    icon: 'none',
    duration: 2000
  });

  return Promise.reject(response);
};

export default {
  baseOptions({
    url,
    data,
    header = {'content-type': 'application/json'},
    method = 'GET'
  }) {

    const defaultOptions = {
      url: url.indexOf('http') !== -1 ? url : baseUrl + url,
      header,
      method,
      data
    };

    return Taro.request(defaultOptions)
      .then(checkStatusAndFilter)
      .then(res => {
        console.log(`http <-- ${url} result:`, res);
        // 结合具体接口返回参数做处理
        return res;
      }).catch((errRes) => {
        if (errRes.statusCode === HTTP_STATUS.AUTHENTICATE ||
          errRes.statusCode === HTTP_STATUS.FORBIDDEN) {
          let path = getCurrentPageUrl();
          if (path !== 'pages/index/index') {
            Taro.navigateTo({
              url: '/pages/index/index'
            });
          }
          return logError('api', '需要鉴权');
        }
        logError('api', '请求接口出现问题', errRes);
      });
  },
  get(url, data = '') {
    let option = {url, data};
    return this.baseOptions(option);
  },
  post(url, data = {}, contentType) {
    let params = {url, data, contentType, method: 'POST'};
    return this.baseOptions(params);
  },
  put(url, data = '') {
    let option = {url, data, method: 'PUT'};
    return this.baseOptions(option);
  },
  delete(url, data = '') {
    let option = {url, data, method: 'DELETE'};
    return this.baseOptions(option);
  }
};
