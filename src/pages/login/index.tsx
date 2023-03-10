import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { Message } from '@/common/components';
import { AtMessage, AtForm, AtInput, AtButton } from 'taro-ui';
import { useState, useEffect } from 'react';
import httpUtil from '../../utils/httpUtil';
import { switchTab, message } from '../../common/functions/index';
import { useDispatch } from '../../redux/hooks';
import { updateUserInfoAC } from '../../redux/actionCreators';
import logo from '../../assets/logo.png';
import './index.less';

type IdentityType = {
  id: number;
  nickname: string;
  permission: string;
  username: string;
  teams: any[];
};

const Login: React.FC = () => {
  useEffect(() => {
    // 由于 app.config.ts 文件中不支持引入，所以不能动态设置 entryPagePath，只能在这里跳转了
    const token = Taro.getStorageSync('token');
    const permission = Taro.getStorageSync('permission');
    if (token) {
      Taro.redirectTo({
        url:
          permission === 'admin'
            ? '/pages/home/managerManage/index'
            : '/pages/home/projectManage/index',
      });
    }
  }, []);
  const dispatch = useDispatch();
  const Wrapper = (props: any) => {
    return (
      <View className='wrapper'>
        <View className='login-wrapper'>
          {props.children}
          <Image className='logo' src={logo}></Image>
        </View>
      </View>
    );
  };
  const FormLogin = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const onReset = () => {
      setPassword('');
      setUsername('');
    };
    const onFinish = async () => {
      const values = {
        username: username,
        password: password,
      };
      try {
        const res = await httpUtil.userLogin(values);
        const user: IdentityType = res.data?.user;
        const token: string = res.data?.token;
        const { permission, teams, id } = user;
        Taro.setStorageSync('user', JSON.stringify(user));
        Taro.setStorageSync('permission', permission);
        Taro.setStorageSync('id', String(id));
        Taro.setStorageSync('teams', JSON.stringify(teams));
        Taro.setStorageSync('token', token);
        // // **********测试用例，上线删除**********
        // Taro.setStorageSync('projectName', 'lpc_test');
        // Taro.setStorageSync('fatherName', 'lpc_test');
        // Taro.setStorageSync('type', 3);
        // Taro.setStorageSync('projectId', 303);
        // Taro.setStorageSync('progressId', 2010);
        // // **********测试用例，上线删除**********
        dispatch(updateUserInfoAC(user));
        message(`欢迎您，${user.nickname || '用户'}`, `success`);
        permission === 'admin'
          ? switchTab('/home/managerManage')
          : switchTab('/home/projectManage');
        // : navigateTo('/home/projectManage/projectOverview');
      } finally {
        onReset();
      }
    };
    return (
      <>
        <AtForm onSubmit={onFinish} onReset={onReset}>
          <AtInput
            focus
            required
            title='账号'
            name='username'
            type='text'
            placeholder='请输入账号'
            value={username}
            onChange={e => setUsername(e as string)}
          />
          <AtInput
            focus
            required
            title='密码'
            name='password'
            type='password'
            placeholder='请输入密码'
            value={password}
            onChange={e => setPassword(e as string)}
          />
          <AtButton
            type='primary'
            onClick={onFinish}
            style={{ marginRight: 20 }}>
            登 录
          </AtButton>
          <AtButton onClick={onReset}>重 置</AtButton>
        </AtForm>
        <AtMessage />
      </>
    );
  };
  return (
    <Wrapper>
      <FormLogin></FormLogin>
    </Wrapper>
  );
};
export default Login;
