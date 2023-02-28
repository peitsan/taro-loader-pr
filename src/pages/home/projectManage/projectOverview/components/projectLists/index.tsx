import react, { FC } from 'react';
import Taro from '@tarojs/taro';
import { IData } from '../../types/projectType';
import ProjectItem from '../projectItem';

interface IType {
  projectData: IData[];
  getOwnProjects?: () => Promise<void>;
}

export const ProjectLists: FC<IType> = (props: IType) => {
  const { projectData, getOwnProjects } = props;
  return (
    <>
      {projectData
        ? projectData.map((item, index) => (
            <ProjectItem
              key={`projectItem-${index}`}
              fatherProject={item.fatherProject}
              sonProject={item.sonProject}
              getOwnProjects={getOwnProjects!}
            />
          ))
        : null}
    </>
  );
};
