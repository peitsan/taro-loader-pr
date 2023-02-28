import Taro from '@tarojs/taro';
import { AtTag } from 'taro-ui';
import { View } from '@tarojs/components';
import TeamList from './teamList/index';
import styles from './index.module.less';

const projectTeamManage: React.FC = () => {
  const permission = Taro.getStorageSync('permission');
  return (
    <>
      <View className={styles.top}>
        <AtTag className={styles.tag} circle>
          团队管理
        </AtTag>
      </View>
      {permission === 'manager' ? (
        <View>
          <TeamList />
        </View>
      ) : (
        <View style={{ margin: '50px auto', textAlign: 'center' }}>
          该模块只对项目经理开放
        </View>
      )}
    </>
  );
};

export default projectTeamManage;
