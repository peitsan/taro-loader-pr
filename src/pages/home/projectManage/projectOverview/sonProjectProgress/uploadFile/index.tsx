import React, { useEffect, useState, FC } from 'react';
import Taro from '@tarojs/taro';
import { Button } from '@tarojs/components';
import httpUtil from '@/utils/httpUtil';
import { AtModal, AtModalHeader, AtModalContent, AtForm } from 'taro-ui';
import styles from './index.module.less';
import Upload from '../upload';

interface IType {
  isUploadVisible: boolean;
  setIsUploadVisible: React.Dispatch<React.SetStateAction<boolean>>;
  getData: () => Promise<void>;
  progressId: number;
  projectId: number;
}

const UploadFile: FC<IType> = (props: IType) => {
  const {
    isUploadVisible,
    setIsUploadVisible,
    getData,
    progressId,
    projectId,
  } = props;
  const [isUpload, setIsUpload] = useState(false);
  const [path, setPath] = useState('');

  const submit = async () => {
    if (!isUpload) {
      console.log('还未上传文件');
    } else {
      // console.log('path', path);
      const res = await httpUtil.uploadAttachment({
        attachment: path,
        progressId,
        projectId,
      });
      if (res.code === 200) {
        Taro.showToast({
          title: '上传成功',
          icon: 'success',
        });
        setIsUploadVisible(false);
        getData();
      }
    }
  };
  const chooseFile = () => {
    Taro.chooseMessageFile({
      count: 1,
      type: 'all',
      success: function (res) {
        const { name, path } = res.tempFiles[0];
        // tempFilePath可以作为img标签的src属性显示图片
        setIsUpload(true);
        Taro.uploadFile({
          url: 'https://sgcc.torcher.team/worker/upload',
          name: 'file',
          header: {
            Authorization: 'Bearer ' + Taro.getStorageSync('token'),
          },
          filePath: path,
          fileName: name,
          success: res => {
            const data = JSON.parse(res.data);
            // console.log('data', data);
            setPath(data.data.file.url);
          },
          fail: () => {
            Taro.showToast({
              title: '上传文件失败',
              icon: 'error',
              duration: 1000,
            });
          },
        });
      },
      fail: function () {
        Taro.showToast({
          title: '取消上传',
          icon: 'error',
          duration: 1000,
        });
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
          {/* <Upload> */}
          <Button onClick={chooseFile}>上传附件</Button>
          {/* </Upload> */}
          <Button className={styles.opeBtn} formType='submit'>
            确定
          </Button>
        </AtForm>
      </AtModalContent>
    </AtModal>
  );
};

export default UploadFile;
