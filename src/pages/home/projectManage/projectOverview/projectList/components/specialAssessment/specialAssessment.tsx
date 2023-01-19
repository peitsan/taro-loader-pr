import Taro from '@tarojs/taro';
import React, { useEffect, useState } from 'react';
import { View } from '@tarojs/components';
import httpUtil from '../../../../../../../utils/httpUtil';
import { IProps, dataItem, tableProps } from './specialAssessmentType';
import styles from './specialAssessment.module.css';
import AccordionForSpecialist from '../../../../../../../common/components/AccordionForSpecialist/index';

export const SpecialAssessment: React.FC<IProps> = ({ Type }: IProps) => {
  const progressId = Taro.getStorageSync('progressId')!;
  const [specialList, setSpecialList] = useState<dataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const columns = [
    {
      title: `标题`,
      dataIndex: 'single',
      key: 'single',
    },
    {
      title: '需解决问题数',
      key: 'number',
      render: (_: any, record: any) => {
        console.log(record);
        const { responsibles, status } = record;
        let manageId = [];
        if (responsibles) {
          manageId = responsibles.map((item: any) => {
            return item.id;
          });
        }
        const { id } = JSON.parse(Taro.getStorageSync('user')!);
        let len = 0;
        if (manageId.includes(id) && status === 1) {
          len = 1;
        }
        const className = len > 0 ? 'num1-color' : 'num-color';
        return <span className={styles[className]}>{len}</span>;
      },
      sorter: (a: any, b: any) => b.len - a.len,
    },
  ];

  // const expandedRowRender = (record: dataItem) => {
  //   const { content } = record;
  //   return <ChildrenTable type={Type} item={content} getSpecial={getSpecial} />;
  // };

  const getSpecial = async () => {
    setLoading(true);
    try {
      const res = await httpUtil.getSpecial({
        progressId,
      });
      if (res.code === 200) {
        const itemList = [];
        let i = 0;
        for (const item of res.data) {
          const {
            id,
            attachment,
            design,
            atizi,
            adate,
            cdate,
            responsibles,
            bchengguo,
            bdate,
            byaoqiu,
            ctizi,
            dyaoqiu,
            ddate,
            dchengguo,
            edate,
            echengguo,
            status,
            adjustReason,
            content,
          } = item;
          itemList.push({
            key: i,
            single: design,
            responsibles,
            status,
            id,
            adate,
            cdate,
            ddate,
            edate,
            content: [
              {
                key: i,
                content,
                adjustReason,
                attachment,
                responsibles,
                status,
                atizi,
                adate,
                bchengguo,
                bdate,
                byaoqiu,
                ctizi,
                cdate,
                dyaoqiu,
                ddate,
                dchengguo,
                edate,
                echengguo,
                id,
              },
            ],
          } as never);
          i++;
        }
        setSpecialList(itemList);
        setLoading(false);
      }
    } finally {
    }
  };

  useEffect(() => {
    getSpecial();
  }, []);

  // 重新封装一个表格组件
  const Table: React.FC<tableProps> = tableProp => {
    const { dataSource } = tableProp;
    return (
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
            标 题
          </View>
          <View
            style={{
              fontWeight: '700',
              fontSize: '32rpx',
              width: '35%',
              textAlign: 'center',
            }}>
            需解决问题数
          </View>
        </View>
        {!dataSource ? (
          <View style={{ textAlign: 'center' }}>暂无数据</View>
        ) : (
          <View className={styles['issueListTable-tabs']}>
            {dataSource.map((item, ind) => {
              return (
                <View key={'Accordion-' + item + `-` + ind}>
                  <AccordionForSpecialist
                    data={item}
                    type={Type as number}
                    getSpecial={getSpecial}
                  />
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <Table dataSource={specialList} />
    </>
  );
};
