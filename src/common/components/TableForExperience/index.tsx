import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { TableForExperienceProps, OperationProps } from './indexProps';
import style from './index.module.less';

const TableForExperience: React.FC<TableForExperienceProps> = selfProps => {
  const { data, onConfirm, onDetail } = selfProps;
  const userId = Number(Taro.getStorageSync('id'));
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
            onClick={() => onDetail(dataList)}
            key={`look-${index}`}
            className={style['normal-a']}>
            查看典例
          </View>
          {userId === dataList.creator && (
            <View>
              <View
                key={`delete-${index}`}
                onClick={() => {
                  onConfirm(dataList.id);
                }}
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
          <View className={style['board-list']}>
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
      <TableHeader />
      <TablePanel />
    </>
  );
};
export default TableForExperience;
