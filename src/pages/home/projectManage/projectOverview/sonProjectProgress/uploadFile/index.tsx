import React, { useEffect, useState, FC } from 'react';
import Taro from '@tarojs/taro';
import { Button, View } from '@tarojs/components';
import httpUtil from '@/utils/httpUtil';
import { AtModal, AtModalHeader, AtModalContent, AtForm } from 'taro-ui';
import styles from './index.module.less';

interface IType {
  isUploadVisible: boolean;
  setIsUploadVisible: React.Dispatch<React.SetStateAction<boolean>>;
  getData: () => Promise<void>;
  progressId: number;
  projectId: number;
  // 控制上传文件名称的显示与隐藏
  isShowFileName: boolean;
  setIsShowFileName: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadFile: FC<IType> = (props: IType) => {
  const {
    isUploadVisible,
    setIsUploadVisible,
    getData,
    progressId,
    projectId,
    isShowFileName,
    setIsShowFileName,
  } = props;
  const [isUpload, setIsUpload] = useState(false);
  const [path, setPath] = useState('');
  const [isShowUploadFile, setIsShowUploadFile] = useState(false);

  const submit = async () => {
    if (!isUpload) {
      Taro.showToast({
        title: '还未上传文件',
        icon: 'error',
        duration: 1000,
      });
    } else {
      const res = await httpUtil.uploadAttachment({
        attachment: path,
        progressId,
        projectId,
      });
      console.log('path', res);
      if (res.code === 200) {
        getData().then(() => {
          Taro.showToast({
            title: '上传文件成功',
            icon: 'success',
            duration: 1000,
          });
          setIsUploadVisible(false);
          setPath(''); // 初始化
          setIsUpload(false); // 初始化
        });
      }
    }
  };
  const chooseFile = () => {
    // console.log('path', path);
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
            // console.log(res);
            const data = JSON.parse(res.data);
            setPath(data.data.file.url);
            setIsShowUploadFile(true);
            setIsShowFileName(true);
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
          {isShowFileName && (
            <View
              style={{
                display: isShowUploadFile ? 'block' : 'none',
                wordBreak: 'break-all',
              }}>
              当前上传文件为: {path}
            </View>
          )}
          {/* <Upload> */}
          <Button onClick={chooseFile} className={styles.uploadBtn}>
            选择附件
          </Button>
          {/* </Upload> */}
          <Button className={styles.opeBtn} formType='submit'>
            上传
          </Button>
        </AtForm>
      </AtModalContent>
    </AtModal>
  );
};

export default UploadFile;
