import Taro from '@tarojs/taro';

export const message = (mes: string, type: string) => {
  return Taro.atMessage({
    message: mes,
    type: type,
  });
};
