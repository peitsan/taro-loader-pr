export default defineAppConfig({
  pages: [
    // 系统登录
    'pages/login/index',
    // 主页
    'pages/home/index',
    /* 
    工程管理
  */
    'pages/home/projectManage/index',
    // 工程总览
    'pages/home/projectManage/projectOverview/index',
    // 三项清单
    'pages/home/projectManage/threeListAudit/index',
    // 工程审核
    // 工程移交
    // 清单审核
    // 上报审核
    /* 
    项目团队管理
  */
    /* 
    典型经验
  */
    /* 
    项目经理管理
  */
    'pages/home/managerManage/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
});
