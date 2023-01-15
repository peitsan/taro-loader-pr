import { Button, Text } from '@tarojs/components'
import {message} from 'antd'
import Taro from '@tarojs/taro'
import './index.less'


const Index = () => {
    const goToIndex = () => {
        Taro.navigateTo({url: '/pages/login/index',success:() => {
            message.info('跳转成功')
        }})
    }
  return (
    <>
      <Text>我的Text</Text>
      <Button onClick={goToIndex}>调转</Button>
    </>
  )
}

export default Index
