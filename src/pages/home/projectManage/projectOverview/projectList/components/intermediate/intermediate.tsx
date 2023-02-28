import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import React, { useEffect, useState } from 'react';
import {
  DataType,
  ExpandedDataType,
  resType,
  res,
  tableProps,
} from './intermediateType';
import AccordionForIntermediate from '../../../../../../../common/components/AccordionForIntermediate/index';
import AccordionForPreIntermediate from '../../../../../../../common/components/AccordionForPreIntermediate';
import httpUtil from '../../../../../../../utils/httpUtil';
import styles from './intermediate.module.css';

export const Intermediate: React.FC = () => {
  const [mediateList, setMediateList] = useState<any[]>([]);
  const projectId = Taro.getStorageSync('projectId');
  const progressId = Taro.getStorageSync('progressId');
  const type = Taro.getStorageSync('type');
  // 列表loading
  const [loading, setLoading] = useState(true);

  const getMediateList = async () => {
    try {
      if (type == '20' || type == '21' || type == '22') {
        const resl = await httpUtil.getCheckForNK({
          projectId: projectId!,
          progressType: Number(type)!,
        });
        console.log(1, resl);
        if (resl.code === 200) {
          setMediateList(resl.data);
          setLoading(false);
        }
      } else {
        const resl = await httpUtil.mediateInspection({
          projectId: projectId!,
          progressId: progressId!,
        });
        console.log(2, resl);
        if (resl.code === 200) {
          setMediateList(resl.data);
          setLoading(false);
        }
      }
    } finally {
    }
  };

  useEffect(() => {
    getMediateList();
  }, []);

  const data: DataType[] = [];
  for (let i = 0; i < mediateList.length; i++) {
    if (mediateList[i].length !== 0) {
      data.push({
        key: i,
        major: mediateList[i][0].major,
        checkList: mediateList[i],
      });
    }
  }

  const Table: React.FC<tableProps> = tableProp => {
    const { dataSource } = tableProp;
    return (
      <>
        {dataSource ? (
          <View className={styles['issueListTable']}>
            {/* 表头 */}
            <View className={styles['issueListTable-title']}>
              <View
                style={{
                  fontWeight: '700',
                  fontSize: '32rpx',
                  width: '30%',
                  textAlign: 'center',
                }}>
                专 业
              </View>
            </View>
            {dataSource.length == 0 ? (
              <View className={styles['boardw-list']}>
                <View
                  style={{
                    textAlign: 'center',
                    lineHeight: '30rpx',
                    fontSize: '30rpx',
                    color: '#9A9A9A',
                  }}>
                  暂无数据
                </View>
              </View>
            ) : (
              <View className={styles['issueListTable-tabs']}>
                {dataSource.map((item, ind) => {
                  return (
                    <View key={'Accordion-' + item + `-` + ind}>
                      {type == '20' || type == '21' || type == '22' ? (
                        <AccordionForPreIntermediate
                          data={item}
                          getMediateList={getMediateList}
                        />
                      ) : (
                        <AccordionForIntermediate
                          data={item}
                          getMediateList={getMediateList}
                        />
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        ) : (
          <View className={styles['boardw-list']}>
            <View
              style={{
                textAlign: 'center',
                lineHeight: '30rpx',
                fontSize: '30rpx',
                color: '#9A9A9A',
              }}>
              暂无数据
            </View>
          </View>
        )}
      </>
    );
  };
  return (
    <>
      <Table dataSource={data} />
    </>
  );
};
