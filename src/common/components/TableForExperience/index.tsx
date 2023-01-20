import Taro from '@tarojs/taro';
import { useState } from 'react';
import { View } from '@tarojs/components';
import httpUtil from '@/utils/httpUtil';
import { AtButton, AtModal } from 'taro-ui';
import {
  TableForExperienceProps,
  DataType,
  OperationProps,
} from './indexProps';
import TypicalExperienceDetail from './TypicalExperienceDetail';
import { message } from '../../functions/index';
import style from './index.module.less';

const TableForExperience: React.FC<TableForExperienceProps> = selfProps => {
  const { data } = selfProps;
  const userId = Number(Taro.getStorageSync('id'));
  const [open, setOpen] = useState<boolean>(false);
  const [detail, setDetail] = useState<boolean>(false);
  const [curData, serCurData] = useState<DataType>();
  const [Data, setData] = useState<DataType[]>(data);
  console.log(data);
  // 打开模态框查阅附件和详情
  const showDrawer = (record: DataType) => {
    setDetail(true);
    serCurData(record);
  };
  const disableDraw = () => {
    console.log('disable');
    setDetail(false);
  };
  const onClose = () => {
    setOpen(false);
  };
  // 确认删除典例
  const confirmDelete = (caseId: number) => {
    const hideLoading = message('请稍后', 'warning');
    httpUtil.deleteOneCase({ caseId }).then(res => {
      if (res.code === 200 || res.status === 'success') {
        const deletedData = Data.filter(item => item.id !== caseId);
        setData(deletedData);
        message('删除成功', 'success');
      } else {
        message('删除失败', 'error');
      }
      hideLoading();
    });
  };

  const TableHeader: React.FC = () => {
    return (
      <View className={style['issueListTable-title']}>
        <View
          style={{
            fontWeight: '700',
            fontSize: '32rpx',
            width: '80%',
            textAlign: 'center',
          }}>
          问题描述
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
    );
  };
  const TablePanel: React.FC = () => {
    const RendorOperation: React.FC<OperationProps> = props => {
      const { dataList, index } = props;
      return (
        <View>
          <View
            onClick={() => showDrawer(dataList)}
            key={`look-${index}`}
            className={style['normal-a']}>
            查看典例
          </View>
          {userId === dataList.creator && (
            <View>
              <AtModal
                title='确认删除该典例吗'
                isOpened={open}
                onConfirm={() => confirmDelete.bind(null, index)}
                onCancel={onClose}
                confirmText='确认'
                cancelText='取消'
              />
              <View
                key={`delete-${index}`}
                onClick={() => setOpen(true)}
                className={style['delete-a']}>
                删除典例
              </View>
            </View>
          )}
        </View>
      );
    };
    return (
      <>
        {data.length !== 0 ? (
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
                    style={{ width: '75%', textAlign: 'left' }}>
                    {list.describe}
                  </View>
                  <View
                    className={style['boardw-subList']}
                    style={{ width: '20%' }}>
                    <RendorOperation dataList={list} index={ids} />
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View className={style['boardw-list']}>暂无数据</View>
        )}
      </>
    );
  };
  return (
    <>
      <TableHeader />
      <TablePanel dataSource={data} />
      <TypicalExperienceDetail
        data={curData}
        onClose={disableDraw}
        open={detail}
      />
    </>
  );
};
export default TableForExperience;
