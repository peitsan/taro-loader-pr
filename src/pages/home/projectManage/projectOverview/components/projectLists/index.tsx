import react, { FC } from 'react';
import Taro from '@tarojs/taro';
import httpUtil from '@/utils/httpUtil';
import { IData } from '../../types/projectType';
import ProjectItem from '../projectItem';

interface IType {
  projectData: IData[];
}

export const ProjectLists: FC<IType> = (props: IType) => {
  const { projectData } = props;
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
