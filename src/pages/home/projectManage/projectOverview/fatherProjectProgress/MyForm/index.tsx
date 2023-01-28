import React, { ReactElement } from 'react';
import Taro from '@tarojs/taro';
import { Button, Input, View } from '@tarojs/components';

interface IItem {
  title: string;
  name: string;
  value: number | string;
  onChange?: (value: number | string) => void;
  type: 'input' | 'button';
}

export const Item = (props: IItem) => {
  const { name, title, onChange, type } = props;
  return type === 'button' ? (
    <Button>{title}</Button>
  ) : type === 'input' ? (
    <Input />
  ) : (
    <></>
  );
};

interface IForm {
  onSubmit?: () => void; // 提交的回调函数
  children: ReturnType<typeof Item> | ReturnType<typeof Item>[];
}

export const MyForm = (props: IForm) => {
  const { onSubmit, children } = props;
  return <View>{children}</View>;
};
