import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { getUnitsAC } from '@/redux/actionCreators';
import httpUtil from '@/utils/httpUtil';
import { message, transPersons } from '@/common/functions';
import { useDispatch, useSelector } from '@/redux/hooks';
import { View } from '@tarojs/components';
import AccordionForListAudit from '@/common/components/AccordionForListAudit';

import { ThreeListQuestionAuditTableProps, tableProps } from './indexProps';
import styles from './index.module.less';

const TableTitle = ['问题概述', '协议名称', '手续名称'];
const ThreeListQuestionAuditTable: React.FC<
  ThreeListQuestionAuditTableProps
> = props => {
  const {
    problemsItem,
    proceduresItem,
    protocolsItem,
    setIsAssignResponsibilities,
    setIsRejectModal,
    setSelectRecord,
    index,
    fresh,
  } = props;
  const [data, setData] = useState<any[]>();
  useEffect(() => {
    if (problemsItem) setData(problemsItem);
    if (proceduresItem) setData(proceduresItem);
    if (protocolsItem) setData(protocolsItem);
  });
  const Table: React.FC<tableProps> = tableProp => {
    const { dataSource } = tableProp;
    console.log(dataSource);
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
                  width: '20%',
                  textAlign: 'center',
                }}>
                {TableTitle[index - 1]}
              </View>
              <View
                style={{
                  fontWeight: '700',
                  fontSize: '32rpx',
                  width: '50%',
                  textAlign: 'center',
                }}>
                所属流程
              </View>
              <View
                style={{
                  fontWeight: '700',
                  fontSize: '32rpx',
                  width: '20%',
                  textAlign: 'center',
                }}>
                操作
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
                      <AccordionForListAudit
                        data={item}
                        setIsAssignResponsibilities={
                          setIsAssignResponsibilities
                        }
                        setSelectRecord={setSelectRecord}
                        setIsRejectModal={setIsRejectModal}
                        index={index}
                        getMediateList={fresh}
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
      <View>
        <Table dataSource={data} />
      </View>
    </>
  );
};

export default ThreeListQuestionAuditTable;
