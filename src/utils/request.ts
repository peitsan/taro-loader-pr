import { request as fetch } from '@tarojs/taro';
import { SyncHooks, AsyncHooks } from '@utils/hooks';

enum Method {
  GET = 'get',
  POST = 'post',
  DELETE = 'delete',
  PUT = 'put',
}

interface DefaultRequestOptions {
  baseUrl?: string;
  method?: Method;
  timeout?: number;
}

interface Options {
  url?: string;
  method?: Method;
  timeout?: number;
}

const options: DefaultRequestOptions = {
  baseUrl: 'https://sgcc.torcher.team',
  method: Method.GET,
  timeout: 5000,
};

async function resolveOptionsBeforeRequest(option: string | Options) {
  if (typeof option === 'string') {
    return Promise.resolve({
      url: request.config.baseUrl + option,
      method: request.config.method,
      timeout: request.config.timeout,
    });
  }
  return Promise.resolve(option);
}

function request(option: string | DefaultRequestOptions) {
  const hooks = new AsyncHooks();
  hooks.use<Options>(resolveOptionsBeforeRequest);
  hooks.use(request.interceptors.request.run);
  hooks.use(fetch as unknown as () => Promise<any>);
  hooks.use(request.interceptors.response.run);
  return hooks.run(option);
}
request.config = options;
request.interceptors = {
  request: new SyncHooks(),
  response: new SyncHooks(),
};

export default request;
