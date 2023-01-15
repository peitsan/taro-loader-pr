// import { Component, PropsWithChildren } from 'react';

import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { AtMessage, AtForm, AtInput, AtButton } from 'taro-ui';
import { useState } from 'react';
import httpUtil from '../../utils/httpUtil';
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
  const dispatch = useDispatch();
  const Wrapper = (props: any) => {
    return (
      <View className='wrapper'>
        <View className='login-wrapper'>
          {props.children}
          <Image className='logo' src={logo} alt='logo'></Image>
        </View>
      </View>
    );
  };
  const FormLogin = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = (path: string) => {
      return Taro.navigateTo({
        url: path,
      });
    };
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
        const res: any = await httpUtil.userLogin(values);
        console.log(res);
        const user: IdentityType = res.data?.user;
        const token: string = res.data?.token;
        const { permission, teams, id } = user;
        Taro.setStorageSync('user', JSON.stringify(user));
        Taro.setStorageSync('permission', permission);
        Taro.setStorageSync('id', String(id));
        Taro.setStorageSync('teams', JSON.stringify(teams));
        Taro.setStorageSync('token', token);
        dispatch(updateUserInfoAC(user));
        Taro.message({
          message: `欢迎您，${user.nickname || '用户'}`,
          type: `success`,
        });
        permission === 'admin'
          ? navigate('/home/managerManage')
          : navigate('/home/projectManage/projectOverview');
      } finally {
        onReset();
      }
    };
    return (
      <>
        <AtForm name='basic' onSubmit={onFinish} onReset={onReset}>
          <AtInput
            required
            title='账号'
            name='username'
            type='text'
            placeholder='请输入账号'
            value={username}
            onChange={e => setUsername(e as string)}
          />
          <AtInput
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
          {/* <AtLoadMore
            moreText='登录'
            loadingText='登陆中...'
            status={loginLoading}
          /> */}
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
