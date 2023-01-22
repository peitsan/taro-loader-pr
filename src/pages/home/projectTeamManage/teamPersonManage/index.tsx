import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { View } from '@tarojs/components';
import httpUtil from '@/utils/httpUtil';
import { AtLoadMore } from 'taro-ui';
import { TeamPersonType, ParamsType } from './indexProps';
import {
  message,
  PersonSelector,
  transPersons,
} from '../../../../common/functions/index';
import BackPrePage from '../../../../common/components/backPrePage/backPrePage';
import { UnitType } from '../../../../redux/units/slice';
import { useSelector, useDispatch } from '../../../../redux/hooks';
import { getUnitsAC } from '../../../../redux/actionCreators';
import { addManagerProjectTeamPerson } from '../../../../utils/params';

import style from './index.module.less';

const TeamList: React.FC = () => {
  const params = useParams<ParamsType>();
  const dispatch = useDispatch();
  const { fatherId, name } = params;
  const [data, setData] = useState<TeamPersonType[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const units = useSelector(state => state.units.data.units as UnitType);
  const searchUnits = useSelector(
    state => state.units.data.searchUnits as UnitType,
  );
  const [loading, setLoading] = useState(true);
  // 获取团队数据
  const getLsit = () => {
    httpUtil.getManagerProjectTeamPerson({ fatherId: fatherId! }).then(res => {
      const units: UnitType[] = res.data?.units;
      const teamPersons: TeamPersonType[] = [];
      for (let unit of units) {
        const { name: unitName, depts } = unit;
        for (let dept of depts) {
          const { name: deptName, workers } = dept;
          for (let worker of workers) {
            const {
              nickname: workerName,
              phone,
              identity,
              id: userId,
            } = worker;
            const teamPerson: TeamPersonType = {
              name: workerName,
              unit: unitName,
              dept: deptName,
              phone,
              identity,
              userId,
            };
            teamPersons.push(teamPerson);
          }
        }
      }
      setData(teamPersons);
      setLoading(false);
    });
  };

  useEffect(() => {
    dispatch( getUnitsAC({ fatherId, getTeamPerson: false })) ;
    getLsit();
  }, []);

  const toTeamPersonManage = (fatherId: number, name: string) => {
    Taro.navigateTo({
      url: `/pages/home/projectTeamManage/teamList/teamPersonManage/index?i=${fatherId}&me=${name}`,
    });
  };

  const TableHeader: React.FC = () => {
    return (
      <View className={style['issueListTable-title']}>
        <View
          style={{
            fontWeight: '700',
            fontSize: '32rpx',
            width: '10%',
            textAlign: 'center',
          }}>
          姓名
        </View>
        <View
          style={{
            fontWeight: '700',
            fontSize: '32rpx',
            width: '20%',
            textAlign: 'center',
          }}>
          单位
        </View>
        <View
          style={{
            fontWeight: '700',
            fontSize: '32rpx',
            width: '20%',
            textAlign: 'center',
          }}>
          部门
        </View>
        <View
          style={{
            fontWeight: '700',
            fontSize: '32rpx',
            width: '10%',
            textAlign: 'center',
          }}>
          身份
        </View>
        <View
          style={{
            fontWeight: '700',
            fontSize: '32rpx',
            width: '20%',
            textAlign: 'center',
          }}>
          手机号码
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
            onClick={() => toTeamPersonManage(dataList.id, dataList.name)}
            key={`look-${index}`}
            className={style['btn-background']}>
            管理团队
          </View>
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
                    style={{ width: '10%' }}>
                    {ids + 1}
                  </View>
                  <View
                    className={style['boardw-subList']}
                    style={{ width: '30%', textAlign: 'left' }}>
                    {list.name}
                  </View>
                  <View
                    className={style['boardw-subList']}
                    style={{ width: '30%', textAlign: 'center' }}>
                    {list.scope ? '规模以上' : '规模以下'}
                  </View>
                  <View
                    className={style['boardw-subList']}
                    style={{ width: '30%' }}>
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
  return loading && loading ? (
    <AtLoadMore status={loading ? 'loading' : 'noMore'}></AtLoadMore>
  ) : (
    <>
      <TableHeader />
      <TablePanel />
    </>
  );
};
export default TeamList;
