import { View, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, { FC } from 'react';
import { BASE_URL } from '@/utils/baseUrl';

interface IUpload {
  children: React.ReactNode;
  // name: string;
  // action: string;
  // headers: {};
  // onChange: Function;
}

const Upload: FC<IUpload> = (props: IUpload) => {
  const { children } = props;
  const token = Taro.getStorageSync('token');
  const submit = () => {
    Taro.chooseMessageFile({
      count: 1,
      success: function (res) {
        // console.log(res);
      },
    });
  };
  return <View onClick={submit}>{children}</View>;
};

export default Upload;
