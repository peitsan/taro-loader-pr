import Taro from '@tarojs/taro';
import { useState, useEffect } from 'react';
import { AtTabs, AtTabsPane, AtLoadMore } from 'taro-ui';
import { View } from '@tarojs/components';
// import { AtTabs, SpinLoading } from 'antd-mobile';
// import {
//   AllIssueList,
//   TechnologyTable,
//   ProjectModel,
//   Intermediate,
//   SpecialAssessment,
// } from './components';
import { TechnologyTable } from './components';
import httpUtil from '../../../../../utils/httpUtil';
import {
  issuesItem,
  problemsItem,
  proceduresItem,
  protocolsItem,
} from './projectListType/projectListType';
import { BackPrePage } from '../../../../../common/index';
import './index.less';

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
  const [selectTab, setSelectTab] = useState<number>(type);
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
  const tabSwitchHandle = (val: number) => {
    setSelectTab(val);
  };
  useEffect(() => {
    getTimeDetail();
    console.log(type);
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
            margin: '2px 0',
            marginBottom: '20px',
            padding: '30px 50px',
            textAlign: 'center',
            borderRadius: '4px',
          }}>
          <AtLoadMore style={{ marginTop: 150 }} />
        </View>
      ) : (
        <View>
          <AtTabs
            scroll
            current={selectTab}
            tabList={TabList}
            onClick={e => tabSwitchHandle(e)}>
            {noUnifiedList.includes(type) ? null : (
              <AtTabsPane current={selectTab} index={0}>
                <View style='width:750rpx; height:200px;padding: 200px 50px;background-color: #FAFBFC;text-align: center;'>
                  统一任务
                </View>
              </AtTabsPane>
            )}
            {noTwoType.includes(type) ? null : (
              <AtTabsPane current={selectTab} index={1}>
                <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>
                  问题清单
                </View>
                {/* 问题清单 */}
                {/* <AllIssueList
                problemsItem={problems}
                index={1}
                fresh={getTimeDetail}
              /> */}
              </AtTabsPane>
            )}
            {noTwoType.includes(type) ? null : (
              <AtTabsPane current={selectTab} index={2}>
                <View style='height:100%;padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>
                  协议清单
                </View>
                {/* 协议清单 */}
                {/* <AllIssueList
                protocolsItem={protocols}
                index={2}
                fresh={getTimeDetail}
              /> */}
              </AtTabsPane>
            )}
            {type === 0 ? null : (
              <AtTabsPane current={selectTab} index={3}>
                <View style='height:100%;padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>
                  手续清单
                </View>
                {/* 手续清单 */}
                {/* <AllIssueList
                proceduresItem={procedures}
                index={3}
                fresh={getTimeDetail}
              /> */}
              </AtTabsPane>
            )}
            {type === 3 || type === 2 ? (
              type === 2 ? (
                // 初设第一阶段中间检查要点
                <AtTabsPane current={selectTab} index={4}>
                  <View style='height:100%;padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>
                    统一任务
                  </View>
                  {/* <Intermediate /> */}{' '}
                </AtTabsPane>
              ) : (
                // 初设第一阶段中间检查要点
                <AtTabsPane current={selectTab} index={5}>
                  <View style='height:100%;padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>
                    统一任务
                  </View>
                  {/* <Intermediate /> */}{' '}
                </AtTabsPane>
              )
            ) : null}
            {type === 0 ? (
              //建设专业可研反馈记录表
              <AtTabsPane current={selectTab} index={6}>
                <View style='50px;background-color: #FAFBFC;'>
                  {/* <TechnologyTable /> */}
                </View>
              </AtTabsPane>
            ) : null}
            {specialList.includes(type) ? (
              //专项评估
              <AtTabsPane current={selectTab} index={7}>
                <View style='50px;background-color: #FAFBFC;'></View>
                {/* <SpecialAssessment Type={type} /> */}
              </AtTabsPane>
            ) : null}
          </AtTabs>
        </View>
      )}
    </View>
  );
}
export default ProjectList;
