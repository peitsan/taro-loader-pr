// import { Component, PropsWithChildren } from 'react';

import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { AtMessage, AtForm, AtInput, AtButton } from 'taro-ui';
import { useState } from 'react';
import { userLogin } from '../../utils/params';
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
    const [loginLoading, setLoginLoading] = useState(false);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = (path: string) => {
      return Taro.navigateTo({
        url: path,
      });
    };
    const onFinish = async () => {
      const values = {
        username: username,
        password: password,
      };
      try {
        setLoginLoading(true);
        const res = await httpUtil.userLogin(values);
        const user: IdentityType = res.data?.user;
        const token: string = res.data?.token;
        const { permission, teams, id } = user;
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('permission', permission);
        sessionStorage.setItem('id', String(id));
        sessionStorage.setItem('teams', JSON.stringify(teams));
        sessionStorage.setItem('token', token);
        dispatch(updateUserInfoAC(user));
        Taro.message({
          message: `欢迎您，${user.nickname || '用户'}`,
          type: `success`,
        });
        permission === 'admin'
          ? navigate('/home/managerManage')
          : navigate('/home/projectManage/projectOverview');
      } finally {
        setLoginLoading(false);
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
            onInput={e => setUsername(e.detail.value)}
          />
          <AtInput
            required
            title='密码'
            name='password'
            type='text'
            placeholder='请输入密码'
            onInput={e => setPassword(e.detail.value)}
          />
          <AtButton
            type='primary'
            htmlType='submit'
            style={{ marginRight: 20 }}>

            登录
          </AtButton>
          <AtButton>重置</AtButton>
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
