import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { Button, Picker, View } from '@tarojs/components';
import httpUtil from '@/utils/httpUtil';
import {
  AtForm,
  AtList,
  AtListItem,
  AtLoadMore,
  AtMessage,
  AtModal,
  AtModalAction,
  AtModalContent,
  AtModalHeader,
} from 'taro-ui';
import { TeamPersonType, ParamsType } from './indexProps';
import { message, transPersons } from '../../../../common/functions/index';
import { PersonSelector } from '../../../../common/components/personSelector/personSelector';
import { UnitType } from '../../../../redux/units/slice';
import { useSelector, useDispatch } from '../../../../redux/hooks';
import { getUnitsAC } from '../../../../redux/actionCreators';
import { addManagerProjectTeamPerson } from '../../../../utils/params';

import style from './index.module.less';

const TeamList: React.FC = () => {
  const { router } = Taro.getCurrentInstance(); //获取路由传入的index参数
  const fatherId: string = router?.params.i; //存储路由传入的index参数
  const name: string = router?.params.me; //存储路由传入的index参数、
  const dispatch = useDispatch();
  const [data, setData] = useState<TeamPersonType[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const units = useSelector(state => state.units.data.units as UnitType);
  const searchUnits = useSelector(
    state => state.units.data.searchUnits as UnitType,
  );
  const [loading, setLoading] = useState(true);
  const [
    addManagerProjectTeamPersonLoading,
    setAddManagerProjectTeamPersonLoading,
  ] = useState(false);
  // 获取团队数据
  const getLsit = () => {
    httpUtil.getManagerProjectTeamPerson({ fatherId: fatherId! }).then(res => {
      const Units: UnitType[] = res.data?.units;
      const teamPersons: TeamPersonType[] = [];
      for (const unit of Units) {
        const { name: unitName, depts } = unit;
        for (const dept of depts) {
          const { name: deptName, workers } = dept;
          for (const worker of workers) {
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
    dispatch(getUnitsAC({ fatherId: fatherId, getTeamPerson: false }));
    getLsit();
  }, []);
  console.log(data);
  const handleAppend = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onFinish = (values: addManagerProjectTeamPerson) => {
    const { userIds: _userIds, identity } = values;
    const userIds = transPersons(_userIds, searchUnits);
    setAddManagerProjectTeamPersonLoading(true);
    httpUtil
      .addManagerProjectTeamPerson({
        userIds,
        identity,
        projectId: Number(fatherId),
      })
      .then(res => {
        const { message: msg, code } = res;
        200 === code
          ? message(msg, 'success')
          : message('新增成员失败', 'error');
        getLsit();
        dispatch(getUnitsAC({ fatherId: fatherId, getTeamPerson: false }));
      })
      .finally(() => {
        setIsModalVisible(false);
        setAddManagerProjectTeamPersonLoading(false);
      });
  };
  const AddStaff: React.FC = () => {
    const Modal = () => {
      const SelectorRange = ['第三方', '员工'];
      const [SelectValue, setSelectValue] = useState<string>('第三方');
      const SelectChecked: string = '第三方';
      return (
        <AtModal isOpened={isModalVisible} onClose={handleCancel}>
          <AtModalHeader>添加人员</AtModalHeader>
          <AtModalContent>
            <AtForm onSubmit={onFinish}>
              <View>
                {/* <PersonSelector /> */}
              </View>
              <View>
                <Picker
                  mode='selector'
                  range={SelectorRange}
                  onChange={e =>
                    console.log(String(Number(e.detail.value as string) + 2))
                  }>
                  <AtList>
                    <AtListItem
                      title='新增成员类型'
                      extraText={SelectChecked}
                    />
                  </AtList>
                </Picker>
              </View>
            </AtForm>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={handleCancel}>取消</Button>{' '}
            <Button onClick={handleAppend}>确定</Button>
          </AtModalAction>
        </AtModal>
      );
    };
    return (
      <>
        <View className={style['normal-a']}> {name}</View>
        <View
          onClick={() => setIsModalVisible(true)}
          className={style['btn-background']}>
          新增成员
        </View>
        <Modal />
      </>
    );
  };
  const TableHeader: React.FC = () => {
    return (
      <View className={style['issueListTable-title']}>
        <View
          style={{
            fontWeight: '700',
            fontSize: '32rpx',
            width: '5%',
            textAlign: 'right',
          }}></View>
        <View
          style={{
            fontWeight: '700',
            fontSize: '32rpx',
            width: '15%',
            textAlign: 'left',
          }}>
          姓名
        </View>
        <View
          style={{
            fontWeight: '700',
            fontSize: '32rpx',
            width: '15%',
            textAlign: 'center',
          }}>
          单位
        </View>
        <View
          style={{
            fontWeight: '700',
            fontSize: '32rpx',
            width: '15%',
            textAlign: 'center',
          }}>
          部门
        </View>
        <View
          style={{
            fontWeight: '700',
            fontSize: '32rpx',
            width: '18%',
            textAlign: 'center',
          }}>
          身份
        </View>
        <View
          style={{
            fontWeight: '700',
            fontSize: '32rpx',
            width: '25%',
            textAlign: 'center',
          }}>
          手机号码
        </View>
        <View
          style={{
            fontWeight: '700',
            fontSize: '32rpx',
            width: '12%',
            textAlign: 'right',
          }}>
          操作
        </View>
      </View>
    );
  };
  const TablePanel: React.FC = () => {
    const confirm = (uId: number, fId: number) => {
      message('请求中', 'warning');
      httpUtil
        .deleteManagerProjectTeamPerson({ userId: uId, fatherId: fId })
        .then(res => {
          const { code, message: msg } = res;
          if (code === 200) {
            message(msg, 'success');
            dispatch(
              getUnitsAC({ fatherId: String(fatherId), getTeamPerson: false }),
            );
            getLsit();
          }
        })
        .finally(() => {});
    };
    const RendorOperation: React.FC<OperationProps> = props => {
      const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
      const { dataList, index } = props;
      const myId = Number(Taro.getStorageSync('id'));
      return myId === dataList.userId ? (
        <View>无</View>
      ) : (
        <View>
          <AtModal
            isOpened={confirmDelete}
            title='确认删除'
            cancelText='取消'
            confirmText='确认'
            onClose={() => setConfirmDelete(false)}
            onCancel={() => setConfirmDelete(false)}
            onConfirm={() => confirm(dataList.userId, Number(fatherId)!)}
            content={`确认要从团队删除${dataList.name}吗?`}
          />
          <View
            onClick={() => setConfirmDelete(true)}
            key={`look-${index}`}
            className={style['btn-background-err']}>
            删除
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
                    style={{ width: '5%' }}>
                    {ids + 1}
                  </View>
                  <View
                    className={style['boardw-subList']}
                    style={{ width: '15%', textAlign: 'left' }}>
                    {list.name}
                  </View>
                  <View
                    className={style['boardw-subList']}
                    style={{ width: '15%', textAlign: 'left' }}>
                    {list.unit}
                  </View>
                  <View
                    className={style['boardw-subList']}
                    style={{ width: '15%', textAlign: 'left' }}>
                    {list.dept}
                  </View>
                  <View
                    className={style['boardw-subList']}
                    style={{ width: '18%', textAlign: 'left' }}>
                    {list.identity}
                  </View>
                  <View
                    className={style['boardw-subList']}
                    style={{ width: '25%', textAlign: 'left' }}>
                    {list.phone}
                  </View>
                  <View
                    className={style['boardw-subList']}
                    style={{ width: '12%' }}>
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
      <AddStaff />
      <TableHeader />
      <TablePanel />
      <AtMessage />
    </>
  );
};
export default TeamList;
