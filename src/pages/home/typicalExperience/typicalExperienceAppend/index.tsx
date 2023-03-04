import Taro from '@tarojs/taro';
import { View, Input, Picker, Button } from '@tarojs/components';
import { useState, useEffect, useRef } from 'react';
import {
  AtMessage,
  AtTag,
  AtTextarea,
  AtForm,
  AtButton,
  AtList,
  AtListItem,
  AtToast,
  AtImagePicker,
} from 'taro-ui';
import styles from './index.module.less';
import httpUtil from '../../../../utils/httpUtil';
import UploadFile from '../../projectManage/projectOverview/sonProjectProgress/uploadFile';
import {
  debounce,
  message,
  navigateTo,
  createFormData,
  getCaption,
  fileToUrl,
  urlToFile,
} from '../../../../common/functions/index';

// import UploadBtn from '../../../../common/components/UploadBtn/UploadBtn';

interface FileProps {
  file: {
    url: String;
    size: number;
  };
  url: Blob;
}

const TypicalExperienceAppend: React.FC = () => {
  const [type, setType] = useState<number | undefined>();
  const [describe, setDescribe] = useState<string>('');
  const [solution, setSolution] = useState<string>('');
  const [point, setPoint] = useState<string>('');
  const [files, setFiles] = useState<FileProps[]>([]);
  const [Path, setPath] = useState<string>('');
  const [value, setValue] = useState<any>('');
  const [loading, setLoginLoading] = useState<any>('');
  // 控制打开上传文件与关闭
  const [isOpenLoadFile, setIsOpenLoadFile] = useState(true);

  // 设置每次下载的文件

  // 下载文件modal展示与否

  const SelectorRange = ['安全', '质量', '技经', '设计', '其他'];
  const SelectorRangeEng = ['SAFE', 'QUALITY', 'EXPERIENCE', 'DESIGN', 'OTHER'];
  const maxLength = 4;
  const chooseFile = useState({
    fileNum: 1,
    files: [],
    showUploadBtn: true,
    upLoadImg: [],
  });
  const onSubmit = async () => {
    // if (files.length > 0)
    //   for (const file of files as FileProps[]) {
    //     if (file.file.size / 2 ** 20 >= 110) {
    //       return message('上传文件大小不能超过110MB', 'warning');
    //     }
    //   }
    const res = '';
    Taro.showLoading({ title: '文件上传中...' });
    const typ = getCaption(files[0].url, '.');
    const fileUrl = {
      url: files[0].url,
      type: 'image/' + (typ === 'jpg' ? 'jpeg' : typ),
      name: '',
    };
    const formData = createFormData({
      type: SelectorRangeEng[(type as number) - 1],
      describe: describe,
      solution: solution,
      point: point,
      files: fileUrl,
    });
    console.log(formData);
    try {
      const res = await httpUtil.createClassicCase(formData);
      if (res.code === 200) {
        message('提交成功', 'success');
        navigateTo(`/home/typicalExperience/experienceList/${type}`);
      }
    } catch {
      message('提交失败', 'error');
    } finally {
      message(`上传成功`, 'success');
    }
  };

  const onReset = () => {
    setType(undefined);
    setDescribe('');
    setSolution('');
    setPoint('');
    setFiles([]);
  };
  const upLoadImg = imgs => {
    Taro.chooseMessageFile({
      count: 1,
      type: 'all',
      success: function (res) {
        const { name, path } = res.tempFiles[0];
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
            console.log(data);

            const attach = {
              file: {
                url: data.data.file.url,
                size: 1111111,
              },
              url: data.data.file.url,
            };
            setPath(data.data.file.url);
            setFiles(preADDL => {
              const updatedADDL = preADDL;
              updatedADDL.push(attach);
              return { ...updatedADDL };
            });
            // setFiles(attach);
            console.log(files);
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
    });
  };
  return (
    <>
      <View className={styles.top}>
        <AtTag className={styles.tag} circle>
          新增典例
        </AtTag>
      </View>
      <View className={styles.container}>
        <View>
          <AtForm onSubmit={onSubmit} onReset={onReset}>
            <View className={styles.title}>选择类别:</View>
            <Picker
              mode='selector'
              range={SelectorRange}
              onChange={e => {
                setType(Number(e.detail.value) + 1);
              }}
              onCancel={() => setType(undefined)}>
              <AtList>
                <AtListItem
                  title='请选择典例类型:'
                  extraText={
                    typeof type !== 'number'
                      ? '请选择类型'
                      : SelectorRange[type - 1]
                  }
                />
              </AtList>
            </Picker>
            <View className={styles.title}>问题概述:</View>
            <AtTextarea
              value={describe}
              onChange={e => debounce(setDescribe(e), 500, false)}
              maxLength={200}
              placeholder='请描述您遇到的问题'
            />
            <View className={styles.title}>解决方案:</View>
            <AtTextarea
              value={solution}
              onChange={e => debounce(setSolution(e), 500, false)}
              maxLength={500}
              placeholder='请描述您的解决方案'
            />
            <View className={styles.title}>注意要点:</View>
            <AtTextarea
              value={point}
              onChange={e => debounce(setPoint(e), 500, false)}
              maxLength={500}
              placeholder='请描述问题的注意要点'
            />
            <View className={styles.title}>相关资料:</View>

            <></>
            <View
              style={{
                wordBreak: 'break-all',
              }}>
              当前上传文件为: {Path}
            </View>
            {/* <Upload> */}
            <Button onClick={upLoadImg} className={styles.uploadBtn}>
              选择附件
            </Button>
            {/* <AtImagePicker
              length={2}
              mode='aspectFill'
              multiple={false}
              count={1} //调用的后端接口不允许多选
              showAddBtn={files?.length !== maxLength}
              files={files}
              onChange={e => onChange(e)}
              onFail={e => console.log('fail', e)}
              onImageClick={(i, file) => {
                //点击预览
                Taro.previewImage({
                  current: file?.url,
                  urls: fileToUrl(files),
                });
              }}
            /> */}
            {/* <UploadBtn chooseImg={chooseFile} onFilesValue={getOnFilesValue} /> */}
            <AtButton formType='submit'>提交</AtButton>
            <AtButton formType='reset'>重置</AtButton>
          </AtForm>
        </View>
        <AtMessage />
      </View>
    </>
  );
};
export default TypicalExperienceAppend;
