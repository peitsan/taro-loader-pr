import Taro from '@tarojs/taro';
import { AtTag } from 'taro-ui';
import { View } from '@tarojs/components';
import TeamList from './teamList/index';
import styles from './index.module.less';

const projectTeamManage: React.FC = () => {
  return (
    <>
      <View className={styles.top}>
        <AtTag className={styles.tag} circle>
          团队总览
        </AtTag>
      </View>
      <View>
        <TeamList />
      </View>
    </>
  );
};

export default projectTeamManage;
