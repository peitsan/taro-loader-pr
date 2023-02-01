/* eslint-disable prettier/prettier */
export default defineAppConfig({
  pages: [
    /* 
    主页(可以不做)
  */
    // 'pages/home/index/index',
    /* 
    工程管理
  */
    'pages/home/projectManage/index',
    /* 
    人员管理
  */
    'pages/home/personManage/index',
    /* 
    项目团队管理
  */
    'pages/home/projectTeamManage/index',
    /* 
    典型经验
  */
    'pages/home/typicalExperience/index',
    /* 
    项目经理管理
  */
    'pages/home/managerManage/index',
  ],
  subpackages: [
    {
      root: 'pages/home/projectManage/projectOverview',
      // 工程总览
      pages: [
        'index',
        // 工程进度
        'fatherProjectProgress/index',
        // 子项目查询
        'sonProjectProgress/index',
        // 三项清单查阅
        'projectList/index',
   
      ],
    },
    {
      root: 'pages/home/projectManage/threeListAudit',
      // 三项清单审批
      pages: ['index',
              'threeListQuestionAudit/index'],
    },
    {
      root: 'pages/home/projectManage/projectHandOver',
      // 工程移交
      pages: ['index'],
    },
    {
      root: 'pages/home/projectManage/projectAudit',
      // 工程审核
      pages: [
        'index',
        // 工程审核
      ],
    },
    {
      root: 'pages/home/projectManage/applyAudit',
      // 上报审核
      pages: [
        'index',
        // 问题完成时间调整表格
        'questionTable/index',
        // 节点预计完成时间调整表格
        'nodeTable/index'
      ],
    },
    /* 
    项目团队管理
  */
    {
      root: 'pages/home/projectTeamManage/teamPersonManage',
      // 团队成员管理
      pages: ['index'],
    },
    /* 
    典型经验
  */
    {
      root: 'pages/home/typicalExperience/typicalExperienceAppend',
      // 新增典型经验
      pages: ['index'],
    },
    {
      // 系统登录
      root: 'pages/login',
      pages: ['index'],
    },
  ],
  entryPagePath: 'pages/home/projectManage/threeListAudit/index',
  // entryPagePath: 'pages/login/index',
  window: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#0EB295',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    color: '#8a8a8a',
    selectedColor: '#18A456',
    backgroundColor: '#FBFBFB',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/projectTeamManage/index',
        text: '团队管理',
        iconPath: './assets/icon/teamAdmin.png',
        selectedIconPath: './assets/icon/teamAdmin-active.png',
      },
      {
        pagePath: 'pages/home/projectManage/index',
        text: '工程管理',
        iconPath: './assets/icon/projectAdmin.png',
        selectedIconPath: './assets/icon/projectAdmin-active.png',
      },
      {
        pagePath: 'pages/home/typicalExperience/index',
        text: '典型经验',
        iconPath: './assets/icon/specialExperience.png',
        selectedIconPath: './assets/icon/specialExperience-active.png',
      },
    ],
  },
});
