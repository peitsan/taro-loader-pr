import { Component, PropsWithChildren } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.less';
import { AtButton } from 'taro-ui';

export default class Index extends Component<PropsWithChildren> {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <View className='index'>
        <Text>Hello</Text>
        <AtButton
          onClick={() => {
            Taro.navigateTo({
              url: '/pages/repairReport/index',
            });
          }}>
          物业保修
        </AtButton>
      </View>
    );
  }
}
