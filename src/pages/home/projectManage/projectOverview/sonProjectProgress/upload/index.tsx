import { View, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, { FC } from 'react';
import { BASE_URL } from '@/utils/baseUrl';

interface IUpload {
  children: React.ReactNode;
  name: string;
  action: string;
  headers: {};
  onChange: Function;
}

const Upload: FC<IUpload> = (props: IUpload) => {
  const { children } = props;
  const token = Taro.getStorageSync('token');
  const submit = () => {
    // Taro.chooseMessageFile({
    //     count: 1,
    //     success: function (res) {
    //         console.log('res', res);
    //         const { name, size, time, type } = res.tempFiles[0];
    //         const blob = new Blob();
    //         const file = new File([blob], name);
    //         console.log(file);

    //         // const body = new FormData()
    //         // body.append('file', file);
    //         // Taro.request({
    //         //     url: `${BASE_URL}/worker/upload`,
    //         //     header: {
    //         //         Authorization: "Bearer " + token,
    //         //     },
    //         //     method: 'POST',
    //         //     data: body,
    //         //     timeout: 2000,
    //         //     success: function (res) {
    //         //         console.log('res', res);
    //         //     },
    //         //     fail: function (err) {
    //         //         console.log(err);
    //         //     }
    //         // })
    //     }
    // })
    Taro.chooseImage({
      success: function (res) {
        console.log(res);
      },
    });
  };
  return <View onClick={submit}>{children}</View>;
};

export default Upload;
