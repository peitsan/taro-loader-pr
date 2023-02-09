import React, { useEffect, useState, FC } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { Button, View } from '@tarojs/components';
import httpUtil from '@/utils/httpUtil';
import {
  AtTag,
  AtIcon,
  AtToast,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtForm,
  AtImagePicker,
} from 'taro-ui';
import styles from './index.module.less';
import Upload from '../upload';

interface IType {
  isUploadVisible: boolean;
  setIsUploadVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const upload = () => {};

const UploadFile: FC<IType> = (props: IType) => {
  const { isUploadVisible, setIsUploadVisible } = props;
  const [isUpload, setIsUpload] = useState(false);
  const [showName, setShowName] = useState<string>('');
  const [url, setUrl] = useState('');
  const submit = () => {
    if (!isUpload) {
      console.log('还未上传文件');
    } else {
      console.log('上传文件');
    }
  };
  const chooseFile = () => {
    Taro.chooseMessageFile({
      count: 1,
      type: 'all',
      success: function (res) {
        const { name, path, size, type } = res.tempFiles[0];
        // tempFilePath可以作为img标签的src属性显示图片
        setShowName(name);
        console.log(res);
        setIsUpload(true);
        console.log('上传成功');
      },
      fail: function () {
        console.log('上传失败');
      },
    });
  };
  return (
    <AtModal
      isOpened={isUploadVisible}
      onClose={() => {
        setIsUploadVisible(false);
      }}>
      <AtModalHeader>上传附件</AtModalHeader>
      <AtModalContent>
        <AtForm onSubmit={submit}>
          <Upload>
            <Button>上传附件</Button>
          </Upload>
          <Button className={styles.opeBtn} formType='submit'>
            确定
          </Button>
        </AtForm>
      </AtModalContent>
    </AtModal>
  );
};

export default UploadFile;
