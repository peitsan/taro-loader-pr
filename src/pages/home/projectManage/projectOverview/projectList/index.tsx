import React, { useState, useEffect } from 'react';
import { Tabs, Spin } from 'antd';
import {
  AllIssueList,
  TechnologyTable,
  ProjectModel,
  Intermediate,
  SpecialAssessment,
} from './components';
import httpUtil from '../../../../../utils/httpUtil';
import {
  issuesItem,
  problemsItem,
  proceduresItem,
  protocolsItem,
} from './projectListType/projectListType';
import { BackPrePage } from '../../../../../common';
import styles from './projectList.module.css';

const { TabPane } = Tabs;

export function ProjectList() {
  const type = Number(localStorage.getItem('type'));
  const defaultKey = type === 8 ? '4' : '1';
  const [indexKey, setIndexKey] = useState<string>(defaultKey);
  const [issuesItem, setIssuesItem] = useState<issuesItem[]>([]);
  const [problemsItem, setProblemItem] = useState<problemsItem[]>([]);
  const [protocolsItem, setProtocolsItem] = useState<protocolsItem[]>([]);
  const [proceduresItem, setProceduresItem] = useState<proceduresItem[]>([]);
  const [fresh, setFresh] = useState<boolean>(false);
  const [flag, setFlag] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const projectName = localStorage.getItem('projectName');
  const fatherName = localStorage.getItem('fatherName');
  setFresh(false);
  const typeName = [
    '可研启动会',
    '中间成果评审会',
    '市公司内审检查',
    '市公司可研内审',
    '国网评审前检查',
    '国网评审',
    '可研技术收口',
    '初步设计部署会',
    '第一次中间检查',
    '第二次中间检查',
    '市公司内审',
    '正式评审前检查',
    '国网公司正式评审',
    '初设批复',
    '专项评估批复及证照办理',
    '经研院预评审',
    '市公司正式评审',
  ];
  //无统一任务typeList
  const noUnifiedList = [0, 5, 6, 8];
  //无科研技术收口和专项评估
  const noTwoType = [0, 8];
  //默认key值
  const defaultKeyList = [
    '5',
    '1',
    '1',
    '1',
    '1',
    '2',
    '2',
    '1',
    '4',
    '1',
    '1',
  ];
  //专项评估
  const specialList = [1, 2, 3, 4, 8];
  const onChange = (key: string) => {
    setIndexKey(key);
  };

  const getTimeDetail = async () => {
    try {
      const res = await httpUtil.getProjectProgressDetail({
        project_id: String(localStorage.getItem('projectId')),
        progress_id: String(localStorage.getItem('progressId')),
      });
      if (res.code === 200) {
        const { issues, problems, procedures, protocols } = res.data;
        setIssuesItem(issues);
        setProblemItem(problems);
        setProceduresItem(procedures);
        setProtocolsItem(protocols);
        setLoading(false);
      }
    } finally {
    }
  };
  const flush = (flush: boolean) => {
    setFlag(flush);
  };
  useEffect(() => {
    getTimeDetail();
  }, [flag, fresh]);

  return (
    <div className='projectView-container'>
      <div className={styles['project-title']}>
        {fatherName}/{projectName}/{typeName[type]}
      </div>
      <BackPrePage />
      <div className='projectView-title-wrp'>
        {/* <div className="projectView-title">
          <div>{localStorage.getItem("name")}</div>
        </div> */}

        {indexKey !== '1' &&
        indexKey !== '5' &&
        indexKey !== '6' &&
        indexKey !== '7' &&
        !JSON.parse(localStorage.getItem('progress')!) ? (
          <div
            className='projectModel-container'
            style={{ position: 'absolute', right: '30px', top: '100px' }}>
            <ProjectModel flushFunction={flush} indexKey={Number(indexKey)} />
          </div>
        ) : null}
      </div>
      {loading ? (
        <div
          style={{
            margin: '20px 0',
            marginBottom: '20px',
            padding: '30px 50px',
            textAlign: 'center',
            borderRadius: '4px',
          }}>
          <Spin style={{ marginTop: 150 }} />
        </div>
      ) : (
        <Tabs defaultActiveKey={defaultKeyList[type]} onChange={onChange}>
          {noUnifiedList.includes(type) ? null : (
            <TabPane tab='统一任务' key='1'>
              <AllIssueList
                issuesItems={issuesItem}
                index={4}
                fresh={getTimeDetail}
              />
            </TabPane>
          )}
          {noTwoType.includes(type) ? null : (
            <TabPane tab='问题清单' key='2'>
              <AllIssueList
                problemsItem={problemsItem}
                index={1}
                fresh={getTimeDetail}
              />
            </TabPane>
          )}
          {noTwoType.includes(type) ? null : (
            <TabPane tab='协议清单' key='3'>
              <AllIssueList
                protocolsItem={protocolsItem}
                index={2}
                fresh={getTimeDetail}
              />
            </TabPane>
          )}
          {type === 0 ? null : (
            <TabPane tab='手续清单' key='4'>
              <AllIssueList
                proceduresItem={proceduresItem}
                index={3}
                fresh={getTimeDetail}
              />
            </TabPane>
          )}
          {type === 2 || type === 3 ? (
            <TabPane
              tab={`初设第${type === 2 ? '一' : '二'}阶段中间检查要点`}
              key='6'>
              <Intermediate />
            </TabPane>
          ) : null}
          {type === 0 ? (
            <TabPane tab='建设专业可研反馈记录表' key='5'>
              <TechnologyTable />
            </TabPane>
          ) : null}
          {specialList.includes(type) ? (
            <TabPane tab='专项评估' key='7'>
              <SpecialAssessment Type={type} />
            </TabPane>
          ) : null}
        </Tabs>
      )}
    </div>
  );
}
