import 'taro-ui/dist/style/index.scss';
import { Component, PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { useEffect } from '@tarojs/react'
import { store } from './redux/store';

const App = (props) => {
  return (
    <Provider store={store}>
      {props.children}
    </Provider>
  )
}
export default App;
