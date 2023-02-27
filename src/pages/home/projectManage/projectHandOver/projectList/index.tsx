import Taro from '@tarojs/taro';
import { useEffect, useRef, useState } from 'react';
import { Button, View } from '@tarojs/components';
import httpUtil from '@/utils/httpUtil';
import {
  AtMessage,
  AtLoadMore,
  AtModal,
  AtModalAction,
  AtModalContent,
  AtModalHeader,
} from 'taro-ui';
import PersonSelector from '@/common/components/personSelector/personSelector';
import { UnitsType } from '@/redux/units/slice';
import { message } from '@/common/index';
import { useDispatch, useSelector } from '../../../../../redux/hooks';
import { getManagersAC } from '../../../../../redux/actionCreators';
import { FatherProjectType, OperationProps } from './indexProps';
import style from './index.module.less';

const ProjectHandOver: React.FC = () => {
  const dispatch = useDispatch();
  const PersonValue = useRef<any>();
  const userId = Number(Taro.getStorageSync('id'));
  const [data, setData] = useState<FatherProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [willHandoverFatherId, setWillHandoverFatherId] = useState<number>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const otherManagers = useSelector(state => state.managers.data.otherManagers);
  const searchManagers = useSelector(
    state => state.managers.data.searchManagers,
  );
  const showModal = (fatherId: number) => {
    setWillHandoverFatherId(fatherId);
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const getOwnProjects = () => {
    httpUtil.getFatherProjects().then(res => {
      const tmp: FatherProjectType[] = res.data;
      // 在返回的所有大项目种筛选出用户（项目经理）创建的大项目
      const managerProjects: FatherProjectType[] = [];
      for (const item of tmp) {
        if (item.creater === userId) {
          item.key = item.id;
          managerProjects.push(item);
        }
      }
      setData(managerProjects);
      setLoading(false);
    });
  };
  const onFinish = () => {
    if (otherManagers.length > 0)
      if (otherManagers[PersonValue?.current?.state.value[0]].depts.length > 0)
        if (
          otherManagers[PersonValue?.current?.state.value[0]].depts[
            PersonValue?.current?.state.value[1]
          ]?.workers.length > 0
        ) {
          const _userIds =
            otherManagers[PersonValue?.current?.state.value[0]]?.depts[
              PersonValue?.current?.state.value[1]
            ]?.workers[PersonValue?.current?.state.value[2]]?.id;
          httpUtil
            .handoverProject({
              fatherId: willHandoverFatherId!,
              userId: _userIds,
            })
            .then(res => {
              const { code, message: msg } = res;
              if (code === 200) {
                message(msg, 'success');
                setIsModalVisible(false);
                getOwnProjects();
              }
            })
            .finally(() => {});
        }
  };
  // 获取项目数据和其他员工
  useEffect(() => {
    dispatch(getManagersAC());
    getOwnProjects();
  }, []);
  const PersonModal: React.FC = () => {
    return (
      <View>
        <AtModal isOpened={isModalVisible}>
          <AtModalHeader>移交项目</AtModalHeader>
          <AtModalContent>
            <View>
              {isModalVisible ? (
                <View>
                  <PersonSelector
                    title='新项目经理'
                    ref={PersonValue}
                    data={otherManagers as UnitsType}
                    placeholder='请选择新的项目经理'
                    width={354}
                    multiple
                  />
                </View>
              ) : (
                <View></View>
              )}
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={handleCancel}>取消</Button>
            <Button onClick={onFinish}>确认</Button>
          </AtModalAction>
        </AtModal>
      </View>
    );
  };
  const TableHeader: React.FC = () => {
    return (
      <View className={style['issueListTable-title']}>
        <View
          style={{
            fontWeight: '700',
            fontSize: '32rpx',
            width: '40%',
            textAlign: 'center',
          }}>
          项目名称
        </View>
        <View
          style={{
            fontWeight: '700',
            fontSize: '32rpx',
            width: '30%',
            textAlign: 'center',
          }}>
          项目规模
        </View>
        <View
          style={{
            fontWeight: '700',
            fontSize: '32rpx',
            width: '30%',
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
            onClick={() => showModal(dataList.id)}
            key={`look-${index}`}
            className={style['btn-background']}>
            移交项目
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
          <View className={style['boardw-list']}>
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
  return loading && loading ? (
    <AtLoadMore status={loading ? 'loading' : 'noMore'}></AtLoadMore>
  ) : (
    <>
      <TableHeader />
      <TablePanel />
      <PersonModal />
      <AtMessage />
    </>
  );
};
export default ProjectHandOver;
