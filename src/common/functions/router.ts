import Taro from '@tarojs/taro';

export const navigateTo = (path: string) => {
  return Taro.navigateTo({
    url: '/pages' + path + '/index',
  });
};

export const switchTab = (path: string) => {
  return Taro.switchTab({
    url: '/pages' + path + '/index',
  });
};
