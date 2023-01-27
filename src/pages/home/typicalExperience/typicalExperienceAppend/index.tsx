import Taro from '@tarojs/taro';
import { View, Input, Picker } from '@tarojs/components';
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
} from 'taro-ui';
import { BASE_URL } from '@/utils/baseUrl';
import styles from './index.module.less';
import httpUtil from '../../../../utils/httpUtil';
import {
  debounce,
  message,
  navigateTo,
} from '../../../../common/functions/index';
import UploadBtn from '../../../../common/components/UploadBtn/UploadBtn';

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
  const [value, setValue] = useState<any>('');
  const [loading, setLoginLoading] = useState<any>('');
  const SelectorRange = ['安全', '质量', '技经', '设计', '其他'];
  const SelectorRangeEng = ['SAFE', 'QUALITY', 'EXPERIENCE', 'DESIGN', 'OTHER'];
  const chooseFile = useState({
    fileNum: 1,
    files: [],
    showUploadBtn: true,
    upLoadImg: [],
  });

  function getBlob(url, callback) {
    const xhr = new window.XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.onload = () => {
      callback(xhr.response);
    };
    xhr.send();
  }
  function createFormData(values = {}, boundary = '') {
    let result = '';
    for (const i in values) {
      result += `\r\n--${boundary}`;
      result += `\r\nContent-Disposition: form-data; name="${i}"`;
      result += '\r\n';
      result += `\r\n${values[i]}`;
    }
    // 如果obj不为空，则最后一行加上boundary
    if (result) {
      result += `\r\n--${boundary}`;
    }
    return result;
  }
  // 生成一个boundary字符串
  const boundary = `----FooBar${new Date().getTime()}`;
  const onSubmit = async () => {
    // formData.append('type', SelectorRangeEng[(type as number) - 1]);
    // formData.append('describe', describe);
    // formData.append('solution', solution);
    // formData.append('point', point);
    if (files.length > 0)
      for (const file of files as FileProps[]) {
        if (file.file.size / 2 ** 20 >= 110) {
          return message('上传文件大小不能超过110MB', 'warning');
        }
      }
    const blob = undefined;
    if (files.length > 0) getBlob(files[0].url, blob);
    console.log(blob);
    console.log(SelectorRangeEng[(type as number) - 1]);
    const val = {
      type: SelectorRangeEng[(type as number) - 1],
      describe: describe,
      solution: solution,
      point: point,
      files: blob,
    };
    console.log(val);
    const formData = createFormData(val, boundary);
    console.log(formData);
    const hide = message('请稍后', 'warning');
    try {
      // setLoginLoading(true);
      const res = await httpUtil.createClassicCase(formData);
      if (res.code === 200) {
        message('提交成功', 'success');
        navigateTo(`/home/typicalExperience/experienceList/${type}`);
      }
    } catch {
      message('提交失败', 'error');
    } finally {
      hide();
      // setLoginLoading(false);
    }
  };

  const onReset = () => {
    setType(undefined);
    setDescribe('');
    setSolution('');
    setPoint('');
    setFiles([]);
  };
  // 拿到子组件上传图片的路径数组
  const getOnFilesValue = (value: any) => {
    console.log(3, value);
    setFiles(value);
    console.log(files);
    const handleChange = val => {
      setValue(val);
    };
    // 上传组件
    // const uploadLoader = data => {
    //   console.log(GetStorageToken());
    //   let i = data.i ? data.i : 0; // 当前所上传的图片位置
    //   let success = data.success ? data.success : 0; //上传成功的个数
    //   let fail = data.fail ? data.fail : 0; //上传失败的个数
    //   Taro.showLoading({
    //     title: `正在上传第${i + 1}张`,
    //   });
    //   // 发起上传
    //   Taro.uploadFile({
    //     url: BASE_URL + '/api/applets/file/uploadFile',
    //     header: {
    //       'content-type': 'multipart/form-data',
    //       Authorization: GetStorageToken().authorization, // 上传需要单独处理cookie
    //     },
    //     name: 'file',
    //     filePath: data[i].file.path,
    //     success: resp => {
    //       console.log(resp);
    //       //图片上传成功，图片上传成功的变量+1
    //       if (resp.statusCode == 200) {
    //         success++;
    //       } else {
    //         fail++;
    //       }
    //     },
    //     fail: () => {
    //       fail++; //图片上传失败，图片上传失败的变量+1
    //     },
    //     complete: () => {
    //       Taro.hideLoading();
    //       i++; //这个图片执行完上传后，开始上传下一张
    //       if (i == data.length) {
    //         //当图片传完时，停止调用
    //         Taro.showToast({
    //           title: '上传成功',
    //           icon: 'success',
    //           duration: 2000,
    //         });
    //       } else {
    //         //若图片还没有传完，则继续调用函数
    //         data.i = i;
    //         data.success = success;
    //         data.fail = fail;
    //         uploadLoader(data);
    //       }
    //     },
    //   });
    // };
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
            <UploadBtn chooseImg={chooseFile} onFilesValue={getOnFilesValue} />
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
