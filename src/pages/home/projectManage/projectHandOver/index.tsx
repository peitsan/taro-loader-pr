import { View } from '@tarojs/components';
import { AtTag } from 'taro-ui';
import styles from './index.module.less';

const Index: React.FC = () => {
  return (
    <>
      <View className={styles.top}>
        <AtTag className={styles.tag} circle>
          工程移交
        </AtTag>
      </View>
    </>
  );
};
export default Index;
