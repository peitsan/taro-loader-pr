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
        console.log(resl);
        if (resl.code === 200) {
          setMediateList(resl.data);
          setLoading(false);
        }
      } else {
        const resl = await httpUtil.mediateInspection({
          projectId: projectId!,
          progressId: progressId!,
        });
        // console.log(resl);
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

  const expandedRowRender = (record: DataType) => {
    const { checkList } = record;
    // console.log(checkList);
    const columns: ColumnsType<ExpandedDataType> = [
      { title: '序号', dataIndex: 'index', key: 'index', width: '6%' },
      {
        title: '检查内容',
        dataIndex: 'checkText',
        key: 'checkText',
        width: '18%',
      },
      { title: '检查要点', dataIndex: 'checkPoint', key: 'checkPoint' },
      {
        title: '状态',
        dataIndex: 'isCheck',
        key: 'isCheck',
        width: '7%',
        render: (text: number) => {
          const className = text === 0 ? 'noCheck' : 'checked';
          return (
            <View className={styles[className]}>
              {text === 0 ? '未审核' : '已审核'}
            </View>
          );
        },
      },
    ];

    const data = [];
    for (let i = 0; i < checkList.length; i++) {
      const { checkPoint, checkText, id, isCheck, major, progressId } =
        checkList[i];
      data.push({
        key: i,
        index: i + 1,
        checkPoint,
        checkText,
        id,
        isCheck,
        major,
        progressId,
      } as never);
    }
    return <></>;
    {
      /* <Table columns={columns} dataSource={data} pagination={false} />; */
    }
  };

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
                      <AccordionForIntermediate
                        data={item}
                        getMediateList={getMediateList}
                      />
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
