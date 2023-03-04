import { Input, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, { useState } from 'react';
import { AtIcon, AtForm, AtInput, AtButton, AtMessage } from 'taro-ui';
import { message } from '../../../../../../../common/functions';
import httpUtil from '../../../../../../../utils/httpUtil';
import styles from './projectForm.module.css';

interface IProps {
  selectList: string;
  handleOk: Function;
}

interface item {
  name: string;
}

export const ProjectForm: React.FC<IProps> = ({
  selectList,
  handleOk,
}: IProps) => {
  const handleEnglishName = () => {
    switch (selectList) {
      case '问题清单':
        return 'problem';
      case '协议清单':
        return 'protocol';
      case '手续清单':
        return 'procedure';
      default:
        return '';
    }
  };
  const handleTagName = () => {
    switch (selectList) {
      case '问题清单':
        return '原因';
      case '协议清单':
        return '意见';
      case '手续清单':
        return '条件';
      default:
        return '';
    }
  };
  const [listSum, setListSum] = useState<number>(1);
  const [items, setItems] = useState<item[]>([{ name: '' }]);
  const [flush, setFlush] = useState<boolean>(false);
  const [itemTitle, setItemTitle] = useState<string>('');
  let timer: NodeJS.Timer;
  const onFinish = () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(async () => {
      if (items.length === 0) {
        return message(`请至少增加一条${selectList}`, 'warning');
      }
      message('请求中', 'warning');
      try {
        const res = await httpUtil.addNewList({
          progress_id: String(Taro.getStorageSync('progressId')),
          type: handleEnglishName(),
          items: items,
          name: itemTitle,
        });

        if (res.code === 200) {
          // form.resetFields();
          setFlush(!flush);
          handleOk(!flush);
          message('添加成功', 'success');
        }
      } finally {
      }
    }, 500);
  };
  const formAppend = () => {
    setListSum(listSum + 1);
    let tmp = items;
    tmp.push({ name: '' });
    setItems(tmp);
  };
  const formDelete = (id: number) => {
    setListSum(listSum - 1);
    let tmp = items;
    tmp.splice(id, 1);
    setItems(tmp);
  };
  const formRefInput = (val, id) => {
    let tmp = items;
    tmp[id].name = val.detail.value;
    setItems(tmp);
  };
  const onConfirm = () => {
    onFinish();
  };
  return (
    <AtForm onSubmit={onFinish}>
      <View className={styles['sheet-list']}>
        <View className={styles['sheet-title']}>
          {' '}
          {selectList.substring(0, 2)}:
        </View>
        <View className={styles['sheet-inputRef']}>
          <Input
            onInput={e => setItemTitle(e.detail.value)}
            value={itemTitle}></Input>
        </View>
      </View>
      <View>
        {items.map((value, index) => {
          return (
            <View key={'form-sheet-' + index} className={styles['sheet-list']}>
              <View className={styles['sheet-title']}>
                {handleTagName() + (index + 1)}:
              </View>
              <View className={styles['sheet-inputRef']}>
                <Input
                  onInput={e => formRefInput(e, index)}
                  value={items[index].name}></Input>
              </View>
              <View className={styles['sheet-delete']}>
                <AtIcon
                  onClick={() => formDelete(index)}
                  value='subtract-circle'
                  size='24'
                  color='#0A0A0A'></AtIcon>
              </View>
            </View>
          );
        })}
      </View>
      <View className={styles['formappend-btn']} onClick={formAppend}>
        新增一条
      </View>
      <AtButton
        type='primary'
        formType='submit'
        className={styles['btn-background']}
        onClick={onConfirm}>
        确定
      </AtButton>
      <AtMessage />
    </AtForm>
  );
};
