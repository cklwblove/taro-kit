import Taro from '@tarojs/taro';
import { HTTP_STATUS } from '@/constants/status';
import { baseUrl } from './config';
import { logError } from '@/utils';

export default {
  baseOptions({
    url,
    data,
    header = {'content-type': 'application/json'},
    method = 'GET'
  }) {
    url += `?timestamp=${timestamp}`;
    const interceptor = function (chain) {
      const requestParams = chain.requestParams;
      let {url, data, method} = requestParams;
      console.log(`http ${method || 'GET'} --> ${url} data: `, data);
      requestParams.url = url.indexOf('http') !== -1 ? url : baseUrl + url;

      return chain.proceed(requestParams)
        .then(res => {
          console.log(`http <-- ${url} result:`, res);
          if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
            return logError('api', '请求资源不存在');
          } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
            return logError('api', '服务端出现了问题');
          } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
            let path = getCurrentPageUrl();
            if (path !== 'pages/index/index') {
              Taro.navigateTo({
                url: '/pages/index/index'
              });
            }
            return logError('api', '没有权限访问');
          } else if (res.statusCode === HTTP_STATUS.AUTHENTICATE) {
            let path = getCurrentPageUrl();
            if (path !== 'pages/index/index') {
              Taro.navigateTo({
                url: '/pages/index/index'
              });
            }
            return logError('api', '需要鉴权');
          } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
            return res.data;
          }
        }).catch((e) => {
          logError('api', '请求接口出现问题', e);
        });
    };

    Taro.addInterceptor(interceptor);

    return Taro.request({data, url, method, header});
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
