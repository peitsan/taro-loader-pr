import { View } from '@tarojs/components';
import { useState, useEffect, useRef } from 'react';
import { AtLoadMore, AtMessage, AtTag } from 'taro-ui';
import styles from './index.module.less';

const TypicalExperienceAppend: React.FC = () => {
  const [loading, setLoading] = useState<Boolean>(true);
  return (
    <>
      <View className={styles.top}>
        <AtTag className={styles.tag} circle>
          新增典例
        </AtTag>
      </View>
      <View style={{ height: '1100rpx' }}>
        {loading ? (
          <View
            style={{
              margin: '2px 0',
              marginBottom: '20px',
              padding: '30px 50px',
              textAlign: 'center',
              borderRadius: '4px',
            }}>
            <AtLoadMore style={{ marginTop: 150 }} />
          </View>
        ) : (
          // 两个清单组件操作模态框调不出来
          <View>1</View>
        )}
        <AtMessage />
      </View>
    </>
  );
};
export default TypicalExperienceAppend;
