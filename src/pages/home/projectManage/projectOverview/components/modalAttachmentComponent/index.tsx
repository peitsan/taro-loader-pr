import React, { FC, useState } from 'react';
import Taro from '@tarojs/taro';
import { AtModal, AtModalHeader, AtModalContent } from 'taro-ui';
import { Button, View } from '@tarojs/components';
import styles from './index.module.less';

interface IModalCheck {
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
  url: string;
  titleName: string;
}

export const ModalAttachmentComponent: FC<IModalCheck> = (
  props: IModalCheck,
) => {
  const { isShow, setIsShow, url, titleName } = props;
  const [font, setFont] = useState<'下载文件' | '打开文件'>('下载文件');
  const [file, setFile] = useState('');

  const downloadFile = () => {
    console.log('url', url);
    Taro.downloadFile({
      url: 'https://sgcc.torcher.team' + url,
      success: res => {
        Taro.showToast({
          title: '下载完成',
          icon: 'success',
        });
        setFile(res.tempFilePath);
        setFont('打开文件');
      },
      header: {
        Authorization: 'Bearer ' + Taro.getStorageSync('token') || '',
      },
    });
  };

  const openFile = (filePath: string) => {
    Taro.openDocument({
      filePath: filePath,
      success: () => {},
      fail: () => {
        Taro.showToast({
          title: '暂不支持该文件的打开',
          icon: 'error',
        });
      },
    });
  };

  return (
    <>
      <AtModal
        isOpened={isShow}
        onClose={() => {
          setFont('下载文件');
          setIsShow(false);
        }}>
        <AtModalHeader>{titleName + '附件'}</AtModalHeader>
        <AtModalContent>
          <View className={styles.title}>{`附件标题: ${url}`}</View>
          <Button
            onClick={() => {
              font === '下载文件' ? downloadFile() : openFile(file);
            }}
            className={styles.openBtn}>
            {font}
          </Button>
        </AtModalContent>
      </AtModal>
    </>
  );
};
