// 配置页面整体路由
import {
  // 通用页面
  Home, NotFound, Login,

  /* 
    工程管理
  */
  // 工程总览
  ProjectManage 
  // ProjectOverview, ProjectProcess, FatherProjectProcess, ProjectList,
  // 工程审核
  // ProjectAudit, ProjectTimeLine, ProgressDetail,
  // // 清单审核
  // ThreeListAudit,
  // ThreeListQuestionAudit,
  // // 上报审核
  // ApplyAudit,
  // QuestionApplyAudit,
  // ProjectApplyAudit,
  // /* 
  //   项目团队管理
  // */
  // ProjectTeamManage,
  // TeamList,
  // TeamPersonManage,
  // /* 
  //   项目经理管理
  // */
  // ManagerManage,

} from "../pages";
import { Navigate } from "react-router-dom"


const routeConfig = [
  // 路由重定向至login
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Navigate to="projectManage" />,
  },
  {
    path: "/home",
    element: <Home />,
    // children: [
    //   {
    //     path: "projectManage",
    //     element: <Navigate to="projectOverview" />
    //   },
    //   {
    //     path: "projectManage",
    //     element: <ProjectManage />,
    //     children: [
    //       // 项目总览
    //       {
    //         path: "projectOverview",
    //         element: <ProjectOverview />,
    //       },
    //       {
    //         path: "projectProcess",
    //         element: <ProjectProcess />
    //       },
    //       {
    //         path: "fatherProjectProcess/:projectId/:projectName/:permission",
    //         element: <FatherProjectProcess />
    //       },
    //       {
    //         path: "projectList",
    //         element: <ProjectList />
    //       },
    //       // 工程审核
    //       {
    //         path: "projectAudit",
    //         element: <ProjectAudit />,
    //       },
    //       {
    //         path: "projectTimeLine/:fatherId/:projectId/:fatherProjectName/:projectName",
    //         element: <ProjectTimeLine />,
    //       },
    //       {
    //         path: "progressDetail/:fatherProjectName/:fatherId/:project_id/:progress_id/:progress_type/:projectName/:progressName",
    //         element: <ProgressDetail />,
    //       },
    //       // 清单审核
    //       {
    //         path: "threeListAudit",
    //         element: <ThreeListAudit />,
    //       },
    //       {
    //         path: "threeListQuestionAudit/:fatherId/:project_id/:fatherProjectName/:projectName",
    //         element: <ThreeListQuestionAudit />,
    //       },
    //       // 上报审核
    //       {
    //         path: "applyAudit",
    //         element: <ApplyAudit />,
    //       },
    //       {
    //         path: "questionApplyAudit",
    //         element: <QuestionApplyAudit />,
    //       },
    //       {
    //         path: "projectApplyAudit",
    //         element: <ProjectApplyAudit />,
    //       },
    //     ]
    //   },
    //   {
    //     path: "projectTeamManage",
    //     element: <Navigate to="teamList" />
    //   },
    //   {
    //     path: "projectTeamManage",
    //     element: <ProjectTeamManage />,
    //     children: [
    //       {
    //         path: "teamList",
    //         element: <TeamList />,
    //       },
    //       {
    //         path: "teamPersonManage/:fatherId/:name",
    //         element: <TeamPersonManage />,
    //       },
    //     ]
    //   },
    //   {
    //     path: "managerManage",
    //     element: <ManagerManage />,
    //   },
    // ]
  },
  {
    path: "*",
    element: <NotFound />,
  },
]

export default routeConfig