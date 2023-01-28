import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import styles from './index.module.less';
import { IData } from '../../../projectOverview/types/projectType';
import { ProjectAccordion } from '../../../components/projectAccordion';
import { ShowMoreInfo } from '../../../components/showMoreInfo';
import { IChProMoreData } from '../../../projectOverview/components/projectItem/moreType';

const ProjectItem = (data: IData) => {
  const { fatherProject, sonProject } = data;
  const [isOpen, setIsOpen] = useState(false);
  const [moreData, setMoreData] = useState<IChProMoreData>();

  // 点击大项目名称跳转
  const clickNav = (e, projectName: string, projectId: number) => {
    // 阻止冒泡
    e.stopPropagation();

    Taro.navigateTo({
      url: `/pages/home/projectManage/projectOverview/fatherProjectProgress/index?name=${projectName}&projectId=${projectId}&permission=${'worker'}`,
    });
  };

  // 点击展示更多信息
  const clickShowMore = (e, data: IChProMoreData) => {
    // 阻止冒泡
    e.stopPropagation();
    setMoreData({
      startTime: data.startTime,
      scope: data.scope,
      progressNow: data.progressNow || '已完成',
    });

    setIsOpen(e => !e);
  };

  // 点击跳转子项目
  const naviToSonPro = (
    e,
    projectId: number,
    projectName: string,
    fatherId: number,
    fatherProName: string,
  ) => {
    e.stopPropagation();
    Taro.navigateTo({
      url: `/pages/home/projectManage/projectOverview/sonProjectProgress/index?projectId=${projectId}&proName=${projectName}&fatherId=${fatherId}&fatherProName=${fatherProName}&permission=${'manager'}`,
    });
  };

  return (
    <>
      <ProjectAccordion
        fatherProject={fatherProject}
        sonProject={sonProject}
        naviToFatherPro={clickNav}
        naviToSonPro={naviToSonPro}
        fatherScope={fatherProject.scope}
        clickShowSonMore={clickShowMore}
      />

      {moreData && (
        <ShowMoreInfo
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          moreData={moreData}
        />
      )}
    </>
  );
};

export default ProjectItem;
