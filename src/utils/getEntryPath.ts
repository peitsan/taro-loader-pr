import Taro from '@tarojs/taro';

const getEntryPath = (token: string | undefined) => {
  if (token) return 'pages/home/projectManage/projectOverview/index';
  else return 'pages/login/index';
};

export const entryPath = getEntryPath(Taro.getStorageSync('token'));
