import Taro from '@tarojs/taro';
import { useState } from 'react';
import { Button, View } from '@tarojs/components';
import httpUtil from '@/utils/httpUtil';
import { TypicalExperienceDetailProps } from './indexProps';
import { AtIcon, AtDrawer, AtButton, AtMessage } from 'taro-ui';

// AtModal,
// AtModalHeader,
// AtModalContent,
// AtModalAction,
import { message } from '../../../functions/index';
import style from './index.module.less';
import { ModalAttachmentComponent } from '../../ModalAttachmentComponent';

const TypicalExperienceDetail: React.FC<
  TypicalExperienceDetailProps
> = selfProps => {
  const { data, open, onClose } = selfProps;
  const userId = Number(Taro.getStorageSync('id'));
  const [canDownload, setCanDownload] = useState(false);
  // 文件下载的URL和name
  const [downloadURL, setDownloadURL] = useState('');
  const [downloadName, setDownloadName] = useState('');
  const [isDolShow, setIsDolShow] = useState(false);

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
      <AtDrawer show={open} mask onClose={onClose}>
        <View className={style['typical-list']}>
          <View className={style['typical-title']}>问题概述:</View>
          <View className={style['typical-content']}>{data.describe}</View>
        </View>
        <View className={style['typical-list']}>
          <View className={style['typical-title']}>解决方案:</View>
          <View className={style['typical-content']}>{data.solution}</View>
        </View>
        <View className={style['typical-list']}>
          <View className={style['typical-title']}>注意要点:</View>
          <View className={style['typical-content']}>{data.point}</View>
        </View>
        <View className={style['typical-list']}>
          <View className={style['typical-title']}>相关资料：</View>
          <View className={style['typical-content']}>{data.point}</View>
        </View>
        <View className='typical-files'>
          {data.files && data.files.length ? (
            <View style={{ color: 'silver' }}>
              <AtIcon value='file-generic' size='30' color='#797979' />
              无附件
            </View>
          ) : (
            <View
              onClick={() => {
                setIsDolShow(true);
              }}>
              <AtIcon value='file-generic' size='30' color='#51796f' />
              下载附件
            </View>
          )}
          <ModalAttachmentComponent
            isShow={isDolShow}
            setIsShow={setIsDolShow}
            url={downloadURL}
            titleName={downloadName}
          />
        </View>
        <AtButton onClick={() => onClose()}>关闭</AtButton>{' '}
      </AtDrawer>
      <AtMessage />
    </>
  );
};
export default TypicalExperienceDetail;
