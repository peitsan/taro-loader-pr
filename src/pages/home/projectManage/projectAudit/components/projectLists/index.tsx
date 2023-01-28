import Taro from '@tarojs/taro';
import React, { useEffect, useState } from 'react';
import httpUtil from '@/utils/httpUtil';
import { IData } from '../../../projectOverview/types/projectType';
import ProjectItem from '../projectItem';

export const ProjectLists = () => {
  const [projectData, setProjectData] = useState<IData[]>();
  const getOwnProjects = async () => {
    try {
      const res = await httpUtil.getOwnProjects({
        identity: 1, // 这里要修改
        isCheck: 1,
      });
      if (res.code === 200) {
        const projectD: IData[] = res.data.projects;
        setProjectData(projectD);
      }
    } catch {
      // 错误处理
    } finally {
    }
  };

  useEffect(() => {
    getOwnProjects();
  }, []);
  return (
    <>
      {projectData
        ? projectData.map((item, index) => (
            <ProjectItem
              key={`projectItem-${index}`}
              fatherProject={item.fatherProject}
              sonProject={item.sonProject}
            />
          ))
        : null}
    </>
  );
};
