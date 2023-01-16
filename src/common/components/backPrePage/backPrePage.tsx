import Taro from '@tarojs/taro';
import { AtIcon } from 'taro-ui';
import { View } from '@tarojs/components';
import './backPrePage.module.css';

export function BackPrePage() {
  return (
    <View
      className='back'
      onClick={() => {
        Taro.navigateBack({ delta: 1 });
      }}>
      <AtIcon value='chevron-left' size='30' color='#F00' />
      返回
    </View>
  );
}
