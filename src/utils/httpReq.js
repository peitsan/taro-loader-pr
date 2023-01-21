/* 
  自定义封装的http请求方法——httpReq
  其中对错误进行了统一处理
*/
import Taro from '@tarojs/taro';
import { message } from 'antd-mobile';
import { BASE_URL } from './baseUrl';
import { HTTP_STATUS } from './HttpConfig';
/**
 * @description 获取当前页url
 */
const getCurrentPageUrl = () => {
  const pages = Taro.getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const url = currentPage.route;
  return url;
};
const pageToLogin = () => {
  const path = getCurrentPageUrl();
  Taro.clearStorage();
  if (!path.includes('login')) {
    Taro.reLaunch({
      url: '/pages/login/login',
    });
  }
};

const customInterceptor = chain => {
  const requestParams = chain.requestParams;
  Taro.showLoading({
    title: '加载中',
  });
  return chain
    .proceed(requestParams)
    .then(res => {
      Taro.hideLoading();
      // 只要请求成功，不管返回什么状态码，都走这个回调
      if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
        return Promise.reject({ desc: '请求资源不存在' });
      } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
        return Promise.reject({ desc: '服务端出现了问题' });
      } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
        Taro.setStorageSync('Authorization', '');
        pageToLogin();
        // TODO 根据自身业务修改
        return Promise.reject({ desc: '没有权限访问' });
      } else if (res.statusCode === HTTP_STATUS.AUTHENTICATE) {
        Taro.setStorageSync('Authorization', '');
        pageToLogin();
        return Promise.reject({ desc: '需要鉴权' });
      } else if (res.statusCode === HTTP_STATUS.SERVER_ERROR) {
        return Promise.reject({ desc: '服务器错误' });
      } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
        return res.data;
      }
    })
    .catch(error => {
      Taro.hideLoading();
      console.error(error);
      return Promise.reject(error);
    });
};

// Taro 提供了两个内置拦截器
// logInterceptor - 用于打印请求的相关信息
// timeoutInterceptor - 在请求超时时抛出错误。
// const interceptors = [customInterceptor, Taro.interceptors.logInterceptor]
const interceptors = [customInterceptor];
interceptors.forEach(interceptorItem => Taro.addInterceptor(interceptorItem));

const request = function (params) {
  const { url, data, method, headers } = params;
  // let contentType = "application/x-www-form-urlencoded";
  let contentType = 'application/json';
  contentType = headers?.contentType || contentType;

  const option = {
    url: BASE_URL + url, //地址
    data: data, //传参
    method: method, //请求方式
    timeout: 50000, // 超时时间
    header: {
      //请求头
      'content-type': contentType,
      Authorization: 'Bearer ' + Taro.getStorageSync('token') || '',
    },
  };
  return Taro.request(option);
};
export const httpReq = (method, url, form, resType) => {
  return new Promise((resolve, reject) => {
    request({
      method: method,
      url: url,
      data: form,
      responseTypwe: resType,
    }).then(
      data => {
        resolve(data);
      },
      err => {
        // 错误在这统一处理
        const status = err.response?.status;
        const errInfo = err.response?.data.message || status;
        // 将错误信息传递下去，用于结束请求loading
        reject({ status, errInfo });
        // 根据状态码做提示处理
        switch (status) {
          case 200:
            message.error(`请求成功`);
            break;
          case 400:
            message.error(`请求错误: ${errInfo}`);
            break;
          case 401:
            message.error(`认证失败: ${errInfo}`);
            window.location.href = '/login';
            break;
          case 403:
            message.error(`授权失败: ${errInfo}`);
            break;
          case 404:
            message.error(`未找到资源: ${errInfo}`);
            break;
          case 412:
            message.error(`请求错误: ${errInfo}`);
            break;
          case 500:
            message.warning(`服务器未能处理`);
            break;
          default:
            break;
        }
      },
    );
  });
<<<<<<< HEAD
   
};
=======

};
>>>>>>> 20eee0f7e4cb504d5d3efac60e0656f3ff5f1278
