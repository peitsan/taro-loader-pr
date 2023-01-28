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

  return (
    <>
      <ProjectAccordion
        fatherProject={fatherProject}
        sonProject={sonProject}
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
