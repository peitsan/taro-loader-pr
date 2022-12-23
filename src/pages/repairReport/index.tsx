import { Component, PropsWithChildren } from 'react';
import { View, Text,Input,} from '@tarojs/components';
import './index.less';
import { AtButton ,AtInput,AtTextarea} from 'taro-ui'
export default class Index extends Component<PropsWithChildren> {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <View>
         <View className="border">
        <View className='list'>
          <View className='title'>
            服务类型
          </View>
          <View className= 'container'>
            <select className='selector'
              >
              请选择服务类型     
            </select>
          </View>
        </View>
        <View className='list'>
          <View className='title'>
            服务区域
          </View>
          <View className= 'container'>
            <select className='selector'
              >
              请选择服务类型     
            </select>
          </View>
        </View>
        <View className='list'>
          <View className='title'>
            联系电话
          </View>
          <View className= 'container'>
            <select className='selector'
              >
              请选择服务类型     
            </select>
          </View>
        </View>
        <View className='list'>
          <View className='title'>
            保修区域
          </View>
          <View className= 'container'>
            <select className='selector'
              >
              请选择服务类型     
            </select>
          </View>
        </View>
        <View className='list'>
          <View className='title'>
            申报内容
          </View>
          <View className= 'container'>
            <select className='selector'
              >
              请选择服务类型     
            </select>
          </View>
        </View>
      </View>
      <AtButton className='submitBtn'>
        <h2 color="#fff">提 交</h2>
      </AtButton>
      </View>
    );
  }
}
