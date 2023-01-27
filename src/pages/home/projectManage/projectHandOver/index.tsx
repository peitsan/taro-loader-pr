import { View } from '@tarojs/components';
import { AtTag, AtModal } from 'taro-ui';
import styles from './index.module.less';
import ProjectHandOver from './projectList/index';

const Index: React.FC = () => {
  return (
    <>
      <View className={styles.top}>
        <AtTag className={styles.tag} circle>
          工程移交
        </AtTag>
      </View>
      <View>
        <ProjectHandOver />
      </View>
    </>
  );
};
export default Index;
