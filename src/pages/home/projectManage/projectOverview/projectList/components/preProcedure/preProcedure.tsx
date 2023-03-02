import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import React, { useEffect, useState } from 'react';
import { preProcedureProps } from './preProcedureProps';
// import httpUtil from '../../../../../../../utils/httpUtil';
import style from './preProcedure.module.css';

export const PreProcedure: React.FC<preProcedureProps> = selfProps => {
  const { data } = selfProps;
  // console.log('data', data);
  // const userId = Number(Taro.getStorageSync('id'));
  const TableHeader: React.FC = () => {
    return (
      <View className={style['issueListTable-title']}>
        <View
          style={{
            fontWeight: '700',
            fontSize: '32rpx',
            width: '30%',
            textAlign: 'center',
          }}>
          姓 名
        </View>
        <View
          style={{
            fontWeight: '700',
            fontSize: '32rpx',
            width: '30%',
            textAlign: 'center',
          }}>
          年 龄
        </View>
        <View
          style={{
            fontWeight: '700',
            fontSize: '32rpx',
            width: '30%',
            textAlign: 'center',
          }}>
          住 址
        </View>
      </View>
    );
  };
  const TablePanel: React.FC = () => {
    // const RendorOperation: React.FC<preProcedureProps> = props => {
    //   const { dataList, index } = props;
    //   return <></>;
    // };
    return (
      <>
        {data ? (
          data.map((list, ids) => {
            return (
              <View key={'Experience-' + ids} className={style['boardw']}>
                <View className={style['boardw-list']} key={'reason-row' + ids}>
                  <View
                    className={style['boardw-subList']}
                    style={{ width: '5%' }}>
                    {ids + 1}
                  </View>
                  <View
                    className={style['boardw-subList']}
                    style={{ width: '75%', textAlign: 'left' }}></View>
                  {/* <View
                    className={style['boardw-subList']}
                    style={{ width: '20%' }}>
                    <RendorOperation dataList={list} index={ids} />
                  </View> */}
                </View>
              </View>
            );
          })
        ) : (
          <View
            style={{
              width: '750rpx',
              textAlign: 'center',
              lineHeight: '30rpx',
              fontSize: '30rpx',
              color: '#9A9A9A',
            }}>
            暂无数据
          </View>
        )}
      </>
    );
  };
  return (
    <>
      <TableHeader />
      <TablePanel />
    </>
  );
};
