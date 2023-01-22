import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { View } from '@tarojs/components';
import httpUtil from '@/utils/httpUtil';
import { AtLoadMore } from 'taro-ui';
import { FatherProjectType, OperationProps } from './indexProps';
import style from './index.module.less';

const TeamList: React.FC = () => {
  const userId = Number(Taro.getStorageSync('id'));
  const [data, setData] = useState<FatherProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  // 获取团队数据
  useEffect(() => {
    // 获取用户id
    httpUtil.getFatherProjects().then(res => {
      const Data: FatherProjectType[] = res.data;
      // 在返回的所有大项目种筛选出用户（项目经理）创建的大项目
      const managerProjects: FatherProjectType[] = [];
      for (const item of Data) {
        if (item.creater === userId) {
          item.key = item.id;
          managerProjects.push(item);
        }
      }
      setData(managerProjects);
      setLoading(false);
    });
  }, []);
  const toTeamPersonManage = (fatherId: number, name: string) => {
    Taro.navigateTo({
      url: `/pages/home/projectTeamManage/teamPersonManage/index?i=${fatherId}&me=${name}`,
    });
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
