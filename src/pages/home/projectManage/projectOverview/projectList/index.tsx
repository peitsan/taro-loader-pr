import Taro, { TarBarList } from '@tarojs/taro';
import { useState, useEffect } from 'react';
import { View } from '@tarojs/components';
// import { Tabs, SpinLoading } from 'antd-mobile';
// import {
//   AllIssueList,
//   TechnologyTable,
//   ProjectModel,
//   Intermediate,
//   SpecialAssessment,
// } from './components';
import { AtTabs, AtTabsPane, AtLoadMore } from 'taro-ui';
import httpUtil from '../../../../../utils/httpUtil';
import {
  issuesItem,
  problemsItem,
  proceduresItem,
  protocolsItem,
} from './projectListType/projectListType';
import { BackPrePage } from '../../../../../common/index';
import './index.less';

const Tabs = AtTabs;
const Tab = AtTabsPane;

function ProjectList() {
  const projectName = Taro.getStorageSync('projectName');
  const fatherName = Taro.getStorageSync('fatherName');
  const type = Number(Taro.getStorageSync('type'));
  const defaultKey = type === 8 ? '4' : '1';
  const [indexKey, setIndexKey] = useState<string>(defaultKey);
  const [issues, setIssuesItem] = useState<issuesItem[]>([]);
  const [problems, setProblemItem] = useState<problemsItem[]>([]);
  const [protocols, setProtocolsItem] = useState<protocolsItem[]>([]);
  const [procedures, setProceduresItem] = useState<proceduresItem[]>([]);
  const [fresh, setFresh] = useState<boolean>(false);
  const [flag, setFlag] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  // setFresh(false);
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
  // //无统一任务typeList
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
  const TabList = [
    { title: '统一任务' },
    { title: '问题清单' },
    { title: '协议清单' },
    { title: '手续清单' },
    { title: '协议清单' },
    { title: '初设第一阶段中间检查要点' },
    { title: '初设第二阶段中间检查要点' },
    { title: '建设专业可研反馈记录表' },
    { title: '专项评估' },
  ];
  //专项评估
  const specialList = [1, 2, 3, 4, 8];
  const onChange = (key: string) => {
    setIndexKey(key);
  };

  // 这里注释了取项目id的请求体
  const getTimeDetail = async () => {
    try {
      const res = await httpUtil.getProjectProgressDetail({
        // project_id: String(Taro.getStorageSync('projectId')),
        // progress_id: String(Taro.getStorageSync('progressId')),
        project_id: String(304),
        progress_id: String(2018),
      });
      if (res.code === 200) {
        const { issue, problem, procedure, protocol } = res.data;
        setIssuesItem(issue);
        setProblemItem(problem);
        setProceduresItem(procedure);
        setProtocolsItem(protocol);
        setLoading(false);
      }
    } finally {
    }
  };
  const flush = (flsh: boolean) => {
    setFlag(flsh);
  };
  useEffect(() => {
    getTimeDetail();
  }, [flag, fresh]);

  return (
    <View className='projectView-container'>
      <View className='project-title'>
        {fatherName}/{projectName}/{typeName[type]}
      </View>
      <BackPrePage />
      <View className='projectView-title-wrp'>
        <View className='projectView-title'>
          <View>{Taro.getStorageSync('name')}</View>
        </View>
        {indexKey !== '1' &&
        indexKey !== '5' &&
        indexKey !== '6' &&
        indexKey !== '7' &&
        !JSON.parse(Taro.getStorageSync('progress')!) ? (
          <View
            className='projectModel-container'
            style={{ position: 'absolute', right: '30px', top: '100px' }}>
            {/* <ProjectModel flushFunction={flush} indexKey={Number(indexKey)} /> */}
          </View>
        ) : null}
      </View>
      {loading ? (
        <View
          style={{
            margin: '20px 0',
            marginBottom: '20px',
            padding: '30px 50px',
            textAlign: 'center',
            borderRadius: '4px',
          }}>
          <AtLoadMore style={{ marginTop: 150 }} />
        </View>
      ) : (
        <Tabs scroll={true} current={type} tabList={TabList} onChange={onChange}>
          {noUnifiedList.includes(type) ? null : (
            <Tab current={type} index={1}>
              {/* <AllIssueList
                issuesItems={issues}
                index={4}
                fresh={getTimeDetail}
              /> */}
            </Tab>
          )}
          {noTwoType.includes(type) ? null : (
            <Tab current={type} index={2}>
              {/* <AllIssueList
                problemsItem={problems}
                index={1}
                fresh={getTimeDetail}
              /> */}
            </Tab>
          )}
          {noTwoType.includes(type) ? null : (
            <Tab current={type} index={3}>
              {/* <AllIssueList
                protocolsItem={protocols}
                index={2}
                fresh={getTimeDetail}
              /> */}
            </Tab>
          )}
          {type === 0 ? null : (
            <Tab current={type} index={4}>
              {/* <AllIssueList
                proceduresItem={procedures}
                index={3}
                fresh={getTimeDetail}
              /> */}
            </Tab>
          )}
          {type === 2 ? (
            <Tab current={type} index={7}>
              {/* <Intermediate /> */}{' '}
            </Tab>
          ) : null}
          {type === 3 || type === 2 ?({
          (type === 2)?(
              <Tab current={type} index={6}>
              {/* <Intermediate /> */}{' '}
              </Tab>
            ):(
              <Tab current={type} index={5}>
              {/* <Intermediate /> */}{' '}
        </Tab>
            )
          } ): null}
          {specialList.includes(type) ? (
            <Tab current={type} index={8}>
              {/* <SpecialAssessment Type={type} /> */}
            </Tab>
          ) : null}
        </Tabs>
      )}
    </View>
  );
}
export default ProjectList;
