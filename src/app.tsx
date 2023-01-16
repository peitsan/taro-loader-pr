import 'taro-ui/dist/style/index.scss';
import { Component, PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';

class App extends Component<PropsWithChildren> {
  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}
export default App;
