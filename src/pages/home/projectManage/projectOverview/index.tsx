import react, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import httpUtil from '@/utils/httpUtil';
import { AtTag } from 'taro-ui';
import { View } from '@tarojs/components';
import { ProjectModel, ProjectLists } from './components';
import { IData } from './types/projectType';
import styles from './index.module.less';

const ProjectOverview = () => {
  const [projectData, setProjectData] = useState<IData[]>();
  const getOwnProjects = async () => {
    try {
      const res = await httpUtil.getOwnProjects({
        identity: 1, // 这里要修改
        isCheck: 2,
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
      <View className={styles.top}>
        <AtTag className={styles.tag} circle>
          项目总览
        </AtTag>
        <ProjectModel refresh={getOwnProjects} />
      </View>
      {projectData && (
        <ProjectLists
          getOwnProjects={getOwnProjects}
          projectData={projectData}
        />
      )}
    </>
  );
};

export default ProjectOverview;
