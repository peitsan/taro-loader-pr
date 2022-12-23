class SyncHooks {
  hooks: Function[];
  constructor() {
    this.hooks = [];
  }
  use(effect: Function) {
    this.hooks.push(effect);
  }
  run(...args) {
    if (!this.hooks.length) return null;
    const hooks = this.hooks.reverse();
    let result = hooks.pop()!(...args);
    while (hooks.length) {
      result = hooks.pop()!(result);
    }
    return result;
  }
}

class AsyncHooks {
  hooks: ((...args) => Promise<any>)[];
  constructor() {
    this.hooks = [];
  }
  use<T = any>(effect: (...args) => Promise<T>) {
    this.hooks.push(effect);
  }
  async run(...args) {
    if (!this.hooks.length) return Promise.resolve(null);
    const hooks = this.hooks.reverse();
    let result = await hooks.pop()!(...args);
    while (hooks.length) {
      result = await hooks.pop()!(result);
    }
    return result;
  }
}

export { SyncHooks, AsyncHooks };
