import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtTag, AtModal } from 'taro-ui';
import styles from './index.module.less';
import ProjectHandOver from './projectList/index';

const Index: React.FC = () => {
  const permission = Taro.getStorageSync('permission');
  return (
    <>
      {permission === 'manager' ? (
        <>
          <View className={styles['top']}>
            <AtTag className={styles['tag']} circle>
              工程移交
            </AtTag>
          </View>
          <View>
            <ProjectHandOver />
          </View>
        </>
      ) : (
        <View style={{ margin: '50px auto', textAlign: 'center' }}>
          该模块只对项目经理开放
        </View>
      )}
    </>
  );
};
export default Index;
