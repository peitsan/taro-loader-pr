import React, { Component, PropsWithChildren } from 'react';
import 'taro-ui/dist/style/index.scss';
import 'antd-mobile/es/global';
import './styles/global.less';

class App extends Component<PropsWithChildren> {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return this.props.children;
  }
}

export default App;
