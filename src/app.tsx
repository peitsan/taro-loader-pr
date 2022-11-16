import { Component, PropsWithChildren } from 'react'
import { Provider } from 'mobx-react'
import antd from 'antd/dist/antd.css'
import counterStore from './store/counter'
import { useRoutes, HashRouter } from "react-router-dom";
import { message } from "antd";
import routeConfig from "./utils/routeConfig";


import './app.less'
message.config({
  top: 30,
  maxCount: 3,
});

const store = {
  counterStore
}
const Index = () => {
  const element = useRoutes(routeConfig);
  return <div className="app">{element}</div>;
};
// const App = () => (

// );
class App extends Component<PropsWithChildren> {
  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  // this.props.children 就是要渲染的页面
  render () {
    return (
      // <Provider store={store}>
      //   {this.props.children}
      // </Provider>
        <HashRouter>
           <Index />
        </HashRouter>
    )
  }
}

export default App
