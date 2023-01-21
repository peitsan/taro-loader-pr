import react, { FC } from 'react';
import Taro from '@tarojs/taro';
import { AtTag } from 'taro-ui';
import { View } from '@tarojs/components';
import { ProjectModel, ProjectLists } from './components';
import { IData } from './types/projectType';
import styles from './index.module.less';

const ProjectOverview = () => {
  // 测试样例
  const data: IData[] = [
    {
      fatherProject: {
        id: 1,
        name: '项目1',
        scope: 1,
        creater: 35,
        manager: 'mzy',
      },
      sonProject: [
        {
          fatherProject: '1',
          id: 2,
          name: '子项目1',
          progressNow: { name: '中间审查会', id: 15 },
          remark: '空',
          scope: '12',
          startTime: '2023-1-17',
          subType: ' ',
          uncheckedQuestionCount: 0,
          managers: [{ id: 15, nickname: 'mzy', phone: '17073931666' }],
        },
        {
          fatherProject: '1',
          id: 2,
          name: '子项目1',
          progressNow: { name: '中间审查会', id: 15 },
          remark: '空',
          scope: '12',
          startTime: '2023-1-17',
          subType: ' ',
          uncheckedQuestionCount: 0,
          managers: [{ id: 15, nickname: 'mzy', phone: '17073931666' }],
        },
      ],
    },
    {
      fatherProject: {
        id: 2,
        name: '项目2',
        scope: 1,
        creater: 35,
        manager: 'mzy',
      },
      sonProject: [
        {
          fatherProject: '1',
          id: 2,
          name: '子项目1',
          progressNow: { name: '中间审查会', id: 15 },
          remark: '空',
          scope: '12',
          startTime: '2023-1-17',
          subType: ' ',
          uncheckedQuestionCount: 0,
          managers: [{ id: 15, nickname: 'mzy', phone: '17073931666' }],
        },
      ],
    },
  ];

  return (
    <>
      <View className={styles.top}>
        <AtTag className={styles.tag} circle>
          项目总览
        </AtTag>
        <ProjectModel refresh={() => {}} />
      </View>
      <ProjectLists data={data} />
    </>
  );
};

export default ProjectOverview;
