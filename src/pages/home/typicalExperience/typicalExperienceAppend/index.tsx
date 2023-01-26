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
} from 'taro-ui';
import styles from './index.module.less';
import httpUtil from '../../../../utils/httpUtil';
import { debounce } from '../../../../common/functions/index';
import UploadBtn from '../../../../common/components/uploadBtn/uploadBtn';
import { BASE_URL } from '@/utils/baseUrl';

const TypicalExperienceAppend: React.FC = () => {
  const [type, setType] = useState<number | undefined>();
  const [describe, setDescribe] = useState<string>('');
  const [solution, setSolution] = useState<string>('');
  const [point, setPoint] = useState<string>('');
  const [files, setFiles] = useState<string>('');
  const [value, setValue] = useState<any>('');
  const SelectorRange = ['安全', '质量', '技经', '设计', '其他'];
  const SelectorRangeEng = ['SAFE', 'QUALITY', 'EXPERIENCE', 'DESIGN', 'OTHER'];
  const [chooseFile, setChooseFile] = useState({
    files: [],
    showUploadBtn: true,
    upLoadImg: [],
  });
  const onSubmit = () => {
    console.log(solution);
    console.log(SelectorRangeEng[(type as number) - 1]);
  };
  const GetStorageToken = () => {
    return Taro.getStorageSync('token');
  };
  const onReset = () => {
    setType(undefined);
    setDescribe('');
    setSolution('');
    setPoint('');
    setFiles('');
  };
  // 拿到子组件上传图片的路径数组
  const getOnFilesValue = (value: any) => {
    console.log(3, value);
    setFiles(value);
    () => {
      console.log(files);
    };
    const handleChange = val => {
      setValue(val);
    };
    // 上传组件
    const uploadLoader = data => {
      console.log(GetStorageToken());
      let that = this;
      let i = data.i ? data.i : 0; // 当前所上传的图片位置
      let success = data.success ? data.success : 0; //上传成功的个数
      let fail = data.fail ? data.fail : 0; //上传失败的个数
      Taro.showLoading({
        title: `正在上传第${i + 1}张`,
      });
      // 发起上传
      Taro.uploadFile({
        url: BASE_URL + '/api/applets/file/uploadFile',
        header: {
          'content-type': 'multipart/form-data',
          Authorization: GetStorageToken().authorization, // 上传需要单独处理cookie
        },
        name: 'file',
        filePath: data[i].file.path,
        success: resp => {
          console.log(resp);
          //图片上传成功，图片上传成功的变量+1

          if (resp.statusCode == 200) {
            success++;
          } else {
            fail++;
          }
        },
        fail: () => {
          fail++; //图片上传失败，图片上传失败的变量+1
        },
        complete: () => {
          Taro.hideLoading();
          i++; //这个图片执行完上传后，开始上传下一张
          if (i == data.length) {
            //当图片传完时，停止调用
            Taro.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 2000,
            });
          } else {
            //若图片还没有传完，则继续调用函数
            data.i = i;
            data.success = success;
            data.fail = fail;
            uploadLoader(data);
          }
        },
      });
    };
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
