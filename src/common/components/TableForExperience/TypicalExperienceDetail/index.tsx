import Taro from '@tarojs/taro';
import { useState } from 'react';
import { Button, View } from '@tarojs/components';
import httpUtil from '@/utils/httpUtil';
import { TypicalExperienceDetailProps } from './indexProps';
import {
  AtIcon,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtButton,
  AtMessage,
} from 'taro-ui';
import { message } from '../../../functions/index';
import style from './index.module.less';

const TypicalExperienceDetail: React.FC<
  TypicalExperienceDetailProps
> = selfProps => {
  const { data, open, onClose } = selfProps;
  const userId = Number(Taro.getStorageSync('id'));
  const [canDownload, setCanDownload] = useState(false);
  // 文件下载的URL和name
  const [downloadURL, setDownloadURL] = useState('');
  const [downloadName, setDownloadName] = useState('');
  const downloadFile = (replyFile: string) => {
    setCanDownload(false);
    const hideLoading = message('下载中', 'warning');
    httpUtil
      .downloadFile({ replyFile })
      .then(res => {
        const blob = new Blob([res.blob], {
          type: 'application/octet-stream',
        });
        const downURL = window.URL.createObjectURL(blob);
        console.log(res, downURL);
        const downName = res.fileName;
        setDownloadURL(downURL);
        setDownloadName(downName);
        setCanDownload(true);
      })
      .catch(() => {
        message('下载失败', 'error');
      })
      .finally(() => {
        message('下载成功', 'success');
        hideLoading();
      });
  };

  const clearFileStatusClose = () => {
    setCanDownload(false);
    setDownloadURL('');
    const hideLoading = message('下载中', 'warning');
    onClose();
    if (typeof hideLoading === 'function') {
      hideLoading();
    }
  };

  // 拆分文件名字
  const getFileName = (file: string) => {
    const fileName = file.replace(/^\/\w*\/\w*\/\d*-/, '');
    return fileName;
  };

  if (!data) return <></>;

  return (
    <>
      <AtModal isOpened={open} style={{ zIndex: 99999 }}>
        <AtModalHeader>典例经验</AtModalHeader>
        <AtModalContent>
          <View>
            <View>问题概述:</View>
            <View>{data.describe}</View>
          </View>
          <View>
            <View>解决方案:</View>
            <View>{data.solution}</View>
          </View>
          <View>
            <View>注意要点:</View>
            <View>{data.point}</View>
          </View>
          <View>
            <View>相关资料：</View>
            <View>{data.point}</View>
          </View>
          <View className={style['file-list']}>
            {data.files && data.files.length ? (
              canDownload ? (
                <a
                  href={downloadURL}
                  download={getFileName(data.files[0])}
                  onError={() => console.log('失败')}>
                  <AtIcon value='file-generic' size='30' color='#F00'></AtIcon>
                  {getFileName(data.files[0])}
                </a>
              ) : (
                <a onClick={downloadFile.bind(null, data.files[0])}>
                  <AtIcon value='download' size='30' color='#F00'></AtIcon>
                  下载附件
                </a>
              )
            ) : (
              <View style={{ color: 'silver' }}>
                <AtIcon value='file-generic' size='30' color='#F00'></AtIcon>
                无附件
              </View>
            )}
          </View>
        </AtModalContent>{' '}
        <AtButton onClick={() => onClose()}>关闭</AtButton>{' '}
      </AtModal>
      <AtMessage />
    </>
  );
};
export default TypicalExperienceDetail;
