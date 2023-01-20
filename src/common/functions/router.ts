import Taro from '@tarojs/taro';

export const navigateTo = (path: string) => {
    return Taro.navigateTo({
        url: '/pages' + path + '/index',
    });
};