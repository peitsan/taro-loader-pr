import 'taro-ui/dist/style/index.scss';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import './styles/global.less'

const App = props => {
  return <Provider store={store}>{props.children}</Provider>;
};
export default App;
