import React, { FC, useState } from 'react';
import Taro from '@tarojs/taro';
import { Button, View } from '@tarojs/components';
import httpUtil from '@/utils/httpUtil';
import { useDispatch } from '@/redux/hooks';
import { getApplyListAC } from '@/redux/actionCreators';
import { AtFloatLayout } from 'taro-ui';
import styles from './index.module.less';
import ITable from './type';

export const QuesTable: FC<ITable> = (props: ITable) => {
  const dispatch = useDispatch();
  const { column, data } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [clickIndex, setClickIndex] = useState<number>(0);
  const confirmPass = (approvalId: string) => {
    httpUtil
      .workerApproveQuestionTimeApply({
        approvalId,
      })
      .then(res => {
        dispatch(getApplyListAC());
        // @ts-ignore
        Taro.atMessage({
          message: '操作成功',
          type: 'success',
        });
      });
  };
  const confirmBack = (approvalId: string) => {
    httpUtil
      .workerRejectQuestionTimeApply({
        approvalId,
      })
      .then(res => {
        dispatch(getApplyListAC());
        // @ts-ignore
        Taro.atMessage({
          message: '操作成功',
          type: 'success',
        });
      });
  };
  return (
    <>
      <View className={styles.tableTop}>
        {column.map((item, index) => {
          return (
            <View key={`columnItem-${index}`} className={styles.columnItem}>
              {item}
            </View>
          );
        })}
      </View>
      {data.length !== 0 ? (
        data.map((item, index) => {
          return (
            <View className={styles.items} key={`item-${index}`}>
              <View className={`${styles.columnItem} ${styles.father}`}>
                {item.fatherName}
              </View>
              <View className={`${styles.columnItem} ${styles.proname}`}>
                {item.projectName}
              </View>
              <View className={`${styles.columnItem} ${styles.ofpro}`}>
                {item.progressName}
              </View>
              <View className={`${styles.columnItem} ${styles.more}`}>
                <View
                  onClick={() => {
                    setClickIndex(index);
                    setIsOpen(true);
                  }}>
                  显示更多
                </View>
              </View>
            </View>
          );
        })
      ) : (
        <View className={styles.noData}>暂无数据</View>
      )}
      <AtFloatLayout
        isOpened={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}>
        <View className={styles.moreData}>
          <View>所属清单：{data[clickIndex]?.type}</View>
          {/* @ts-ignore */}
          <View>问题名称: {data[clickIndex]?.superTypeName}</View>
          {/* @ts-ignore */}
          <View>原因名称: {data[clickIndex]?.typeName}</View>
          {/* @ts-ignore */}
          <View>计划完成时间: {data[clickIndex]?.typePlanTime}</View>
          {/* @ts-ignore */}
          <View>申请调整时间: {data[clickIndex]?.typeAdjustTime}</View>
          {/* @ts-ignore */}
          <View>调整原因: {data[clickIndex]?.typeAdjustReason}</View>
          <View>项目经理: {data[clickIndex]?.manager.nickName}</View>
          <View>申请发出时间: {data[clickIndex]?.createTime}</View>
          <View className={styles.btn_div}>
            操作:
            <View>
              <Button
                size='mini'
                type='primary'
                onClick={() => {
                  confirmPass(String(data[clickIndex].id));
                  setIsOpen(false);
                }}>
                通过
              </Button>
              <Button
                size='mini'
                type='warn'
                onClick={() => {
                  confirmBack(String(data[clickIndex].id));
                  setIsOpen(false);
                }}>
                驳回
              </Button>
            </View>
          </View>
        </View>
      </AtFloatLayout>
    </>
  );
};
