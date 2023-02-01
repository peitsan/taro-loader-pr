import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import { IData } from '../../../projectOverview/types/projectType';
import { ProjectAccordion } from '../../../components/projectAccordion';
import { ShowMoreInfo } from '../../../components/showMoreInfo';
import { IChProMoreData } from '../../../projectOverview/components/projectItem/moreType';

const ProjectItem = (data: IData) => {
  const { fatherProject, sonProject } = data;
  const [isOpen, setIsOpen] = useState(false);
  const [moreData, setMoreData] = useState<IChProMoreData>();
  const clickNav = (e, projectName: string, projectId: number) => {
    // 阻止冒泡
    e.stopPropagation();
    Taro.setStorageSync('projectName', projectName);
    Taro.setStorageSync('projectId', projectId);
    Taro.navigateTo({
      url: `/pages/home/projectManage/threeListAudit/threeListQuestionAudit/index`,
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

  const naviToSonPro = (
    e,
    projectId: number,
    projectName: string,
    fatherId: number,
    fatherProName: string,
  ) => {
    e.stopPropagation();
    Taro.setStorageSync('projectName', projectName);
    Taro.setStorageSync('fatherName', fatherProName);
    Taro.setStorageSync('projectId', projectId);
    Taro.setStorageSync('fatherId', fatherId);
    Taro.navigateTo({
      url: '/pages/home/projectManage/threeListAudit/threeListQuestionAudit/index',
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
        showQuestion={true!}
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
