// import 'taro-ui/dist/style/index.scss';
// import Taro, { Component, Config } from '@tarojs/taro';
// import { View, Text } from '@tarojs/components';
// import { AtTextarea, AtButton } from 'taro-ui';
// import Cascader from 'taro-cascader';
import React from 'react';
import { UnitsType } from '../../../redux/units/slice';

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}
// data: UnitsType,
// placeholder: string,
// width: number | string,
// multiple: boolean = true,
export const PersonSelector = (data: UnitsType, width: number | string) => {
  const dataSource = [
    {
      label: '北京',
      value: 'beijing',
      children: [
        {
          label: '海淀',
          value: 'haidian',
          children: [
            {
              label: '清河',
              value: 'qinghe',
              children: [
                {
                  label: '永泰庄',
                  value: 'yongtaizhuang',
                  isLeaf: true,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      label: '江苏',
      value: 'jiangsu',
      children: [
        {
          label: '苏州',
          value: '苏州',
          children: [
            {
              label: '工业园区',
              value: 'gongyeyuanqu',
              children: [
                {
                  label: '金鸡湖',
                  value: 'jinjihu',
                },
              ],
            },
          ],
        },
      ],
    },
  ];
  const onChange = value => {
    console.log(value);
  };
  const options = data.map(unit => {
    const option: Option = {
      value: unit.id,
      label: unit.name,
      children: unit.depts.map(dept => ({
        value: dept.id,
        label: dept.name,
        children: dept.workers.map(worker => ({
          value: worker.id,
          label: worker.nickname,
        })),
      })),
    };
    return option;
  });
  // const loadData = node => {
  //   return new Promise(resolve => {
  //     setTimeout(() => {
  //       node.children = [{ label: '永泰东里', value: 'yongtaidongli' }];
  //       resolve();
  //     }, 2000);
  //   });
  // };
  return (
    // <Cascader
    //   style={{ width }}
    //   options={options}
    //   multiple={multiple}
    //   maxTagCount='responsive'
    //   placeholder={placeholder}
    // />
    <> </>
  );
};
