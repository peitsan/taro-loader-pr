import Taro from '@tarojs/taro';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { View } from '@tarojs/components';
import httpUtil from '../../../../../../../utils/httpUtil';
import { IProps, dataItem, tableProps } from './specialAssessmentType';
import styles from './specialAssessment.module.css';
import AccordionForSpecialist from '../../../../../../../common/components/AccordionForSpecialist/index';

export const SpecialAssessment: React.FC<IProps> = forwardRef(
  ({ ...selfProps }, ref) => {
    const {
      Type,
      setIsCheckModal,
      setIsManageModal,
      setSelectRecord,
      setIsAdjustModal,
      setIsReplyModal,
      setIsPassModal,
      setIsRejetModal,
      setSelectIndex,
      setIsApplyUpper,
      setZxpgData,
    } = selfProps;
    const progressId = Taro.getStorageSync('progressId')!;
    const [specialList, setSpecialList] = useState<dataItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const getSpecial = async () => {
      setLoading(true);
      let res;
      try {
        if (Number(Type) >= 20) {
          res = await httpUtil.getSpecialForKeYan({
            progressId,
          });
        } else {
          res = await httpUtil.getSpecial({
            progressId,
          });
        }
        if (res.code === 200) {
          setZxpgData(res.data);
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
    useImperativeHandle(ref, () => ({
      getSpecial,
    }));
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
                    <AccordionForSpecialist
                      data={item}
                      type={Type as number}
                      setIsApplyUpper={setIsApplyUpper}
                      setIsRejetModal={setIsRejetModal}
                      setIsPassModal={setIsPassModal}
                      setIsCheckModal={setIsCheckModal}
                      setIsManageModal={setIsManageModal}
                      setSelectRecord={setSelectRecord}
                      setIsAdjustModal={setIsAdjustModal}
                      setSelectIndex={setSelectIndex}
                      setIsReplyModal={setIsReplyModal}
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
  },
);
