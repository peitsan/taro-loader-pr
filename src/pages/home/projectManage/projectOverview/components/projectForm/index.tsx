import React, { FC, useState } from 'react';
import { Input, Picker, View } from '@tarojs/components';
import httpUtil from '@/utils/httpUtil';
import {
  AtForm,
  AtList,
  AtListItem,
  AtButton,
  AtToast,
  AtInput,
  AtMessage,
} from 'taro-ui';
import Taro from '@tarojs/taro';
import styles from './index.module.less';

// 定义 interface 用于请求成功关闭上一层的 modal
interface IProps {
  handleReq: Function;
  refresh: () => Promise<void>;
  showOpen: boolean;
}

export const ProjectForm: FC<IProps> = ({
  handleReq,
  refresh,
  showOpen,
}: IProps) => {
  const pickerRange = ['规模以下', '规模以上'];
  const [picker, setPicker] = useState('规模以上');
  const [name, setName] = useState<string>('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  // 放置用户频繁点击
  let timer: NodeJS.Timer;
  const submit = () => {
    if (picker !== '' && name !== '') {
      if (timer) clearTimeout(timer);
      timer = setTimeout(async () => {
        const scope = pickerRange.indexOf(picker);
        setLoading(true);
        try {
          const res = await httpUtil.fatherProjectNewAdd({
            scope,
            name,
          });
          if (res.code === 200) {
            setName(''); // 重置
            // 隐藏上一级的modal
            handleReq();
            refresh().then(() => {
              // @ts-ignore
              Taro.atMessage({ message: '添加成功', type: 'success' });
            });
          }
        } finally {
        }
      }, 500);
    } else setShow(true);
  };
  return (
    <AtForm>
      <Picker
        mode='selector'
        range={pickerRange}
        onChange={e => {
          setPicker(pickerRange[e.detail.value]);
        }}>
        <AtList>
          <AtListItem title='规模选择' extraText={picker} />
        </AtList>
      </Picker>
      <View>
        {showOpen ? (
          <AtInput
            placeholder='请输入项目名称'
            onChange={e => {
              setName(String(e));
            }}
            value={name}
            name='name'
            title='项目名称'
            style={{ zIndex: 101 }}
            focus
          />
        ) : (
          <></>
        )}
      </View>
      <AtButton
        loading={loading}
        type='primary'
        formType='submit'
        className={styles.btn}
        onClick={() => {
          submit();
        }}>
        确定
      </AtButton>
      <AtToast text='请填写完整' isOpened={show}></AtToast>
      <AtMessage />
    </AtForm>
  );
};
