import Taro from '@tarojs/taro';
import { useState, useEffect } from 'react';
import {
  AtButton,
  AtIcon,
  AtLoadMore,
  AtModal,
  AtModalAction,
  AtModalContent,
  AtTabs,
  AtTabsPane,
  AtTextarea,
} from 'taro-ui';
import { Button, View } from '@tarojs/components';
import {
  AllIssueList,
  TechnologyTable,
  SpecialAssessment,
  ProjectModel,
  Intermediate,
} from './components';
import httpUtil from '../../../../../utils/httpUtil';
import {
  issuesItem,
  problemsItem,
  proceduresItem,
  protocolsItem,
  tabListItem,
} from './projectListType/projectListType';
import { BackPrePage, message } from '../../../../../common/index';
import './index.less';

function ProjectList() {
  const projectName = Taro.getStorageSync('projectName');
  const progressName = Taro.getStorageSync('name');
  const fatherName = Taro.getStorageSync('fatherName');
  const type = Number(Taro.getStorageSync('type'));
  // 此处为了方便调试
  const defaultKey = type === 8 ? '4' : '1';
  const [indexKey, setIndexKey] = useState<string>(defaultKey);
  const [issue, setIssuesItem] = useState<issuesItem[]>([]);
  const [problem, setProblemItem] = useState<problemsItem[]>([]);
  const [protocol, setProtocolsItem] = useState<protocolsItem[]>([]);
  const [procedure, setProceduresItem] = useState<proceduresItem[]>([]);
  const [fresh, setFresh] = useState<boolean>(false);
  const [flag, setFlag] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectTab, setSelectTab] = useState<number>(0);
  const [tabList, setTableList] = useState<tabListItem[]>([]);
  const [isCheckModal, setIsCheckModal] = useState<boolean>(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string>('');
  const [replyText, setReplyText] = useState<string>('空');
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

  //专项评估
  const specialList = [1, 2, 3, 4, 8];

  // 这里注释了取项目id的请求体
  const getTimeDetail = async () => {
    try {
      const res = await httpUtil.getProjectProgressDetail({
        project_id: String(Taro.getStorageSync('projectId')),
        progress_id: String(Taro.getStorageSync('progressId')),
      });
      if (res.code === 200) {
        const { issues, problems, procedures, protocols } = res.data;
        console.log(res.data);
        setIssuesItem(issues);
        setProblemItem(problems);
        setProceduresItem(procedures);
        setProtocolsItem(protocols);
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
  const effectTabList = () => {
    const TabList: tabListItem[] = [
      { title: '统一任务' },
      { title: '问题清单' },
      { title: '协议清单' },
      { title: '手续清单' },
      { title: '初设第一阶段中间检查要点' },
      { title: '初设第二阶段中间检查要点' },
      { title: '建设专业可研反馈记录表' },
      { title: '专项评估' },
    ];
    // 无统一任务
    if (noUnifiedList.includes(type)) {
      TabList.splice(
        TabList.findIndex(val => val.title === '统一任务'),
        1,
      );
    }
    //无科研技术收口和专项评估 问题清单
    if (noTwoType.includes(type)) {
      // 一行删除一个元素
      TabList.splice(
        TabList.findIndex(val => val.title === '问题清单'),
        1,
      );
      TabList.splice(
        TabList.findIndex(val => val.title === '协议清单'),
        1,
      );
    }
    // 无手续清单
    if (type === 0) {
      TabList.splice(
        TabList.findIndex(val => val.title === '手续清单'),
        1,
      );
    }
    if (type === 2) {
      TabList.splice(
        TabList.findIndex(val => val.title === '初设第二阶段中间检查要点'),
        1,
      );
    } else if (type === 3) {
      TabList.splice(
        TabList.findIndex(val => val.title === '初设第一阶段中间检查要点'),
        1,
      );
    } else {
      TabList.splice(
        TabList.findIndex(val => val.title === '初设第一阶段中间检查要点'),
        1,
      );
      TabList.splice(
        TabList.findIndex(val => val.title === '初设第二阶段中间检查要点'),
        1,
      );
    }
    // 无初设第一阶段中间检查要点
    if (type > 0) {
      //无建设专业可研反馈记录表
      TabList.splice(
        TabList.findIndex(val => val.title === '建设专业可研反馈记录表'),
        1,
      );
    }
    if (!specialList.includes(type)) {
      //无专项评估
      TabList.splice(
        TabList.findIndex(val => val.title === '专项评估'),
        1,
      );
    }
    setTableList(TabList);
  };

  const okCheckModal = () => {
    setIsCheckModal(false);
  };
  const CheckModal: React.FC = () => {
    const [canDownload, setCanDownload] = useState(false);
    // 文件下载的URL和name
    const [downloadURL, setDownloadURL] = useState('');
    const [downloadName, setDownloadName] = useState('');

    const downloadFile = () => {
      setCanDownload(false);
      const hiding = message('下载中', 'warning');
      httpUtil.downloadFile({ replyFile: attachmentUrl }).then(res => {
        const blob = new Blob([res.blob], {
          type: 'application/octet-stream',
        });
        const URL = window.URL.createObjectURL(blob);
        // const URL = Taro.downloadFile
        const Name = res.fileName;
        setDownloadURL(URL);
        setDownloadName(Name);
        setCanDownload(true);
        hiding();
      });
    };
    return (
      <AtModal
        isOpened={isCheckModal}
        onConfirm={okCheckModal}
        onClose={okCheckModal}>
        <AtModalContent>
          <View className='reply-wrapper'>
            <View className='reply-title'>文字内容：</View>
            <AtTextarea
              className='reply-text-area'
              disabled
              height={5}
              value={replyText}
              onChange={e => setReplyText(e)}
            />
            <View className='reply-title'>附件：</View>
            <View className='reply-files'>
              {attachmentUrl !== '' ? (
                canDownload ? (
                  <a href={downloadURL} download={downloadName}>
                    <AtIcon value='file-generic' size='30' color='#F00' />
                    下载成功，点击查看
                  </a>
                ) : (
                  <a onClick={downloadFile}>
                    <AtIcon value='file-generic' size='30' color='#F00' />
                    下载附件
                  </a>
                )
              ) : (
                <a style={{ color: 'silver' }}>
                  <AtIcon value='file-generic' size='30' color='#F00' />
                  无附件
                </a>
              )}
            </View>
          </View>
        </AtModalContent>
        <AtModalAction>
          {' '}
          <Button onClick={okCheckModal}>确定</Button>{' '}
        </AtModalAction>
      </AtModal>
    );
  };
  useEffect(() => {
    getTimeDetail();
    // 生成tabList
    effectTabList();
  }, [flag, fresh]);
  return (
    <View className='projectView-container'>
      <View className='project-title'>
        {fatherName}/{projectName}/{progressName}
      </View>
      {/* <BackPrePage /> */}
      <View className='projectView-title-wrp'>
        {(selectTab == tabList.findIndex(val => val.title === '问题清单') ||
          selectTab == tabList.findIndex(val => val.title === '手续清单') ||
          selectTab == tabList.findIndex(val => val.title === '协议清单')) &&
        Taro.getStorageSync('ModalName') === 'projectOverview' &&
        !JSON.parse(Taro.getStorageSync('progress')) ? (
          <View
            className='projectModel-container'
            style={{ position: 'absolute', right: '30px', top: '10px' }}>
            {/* 这个还有很多bug */}
            <ProjectModel
              flushFunction={flush}
              selectList={tabList[selectTab].title}
            />
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
        // 两个清单组件操作模态框调不出来
        <View>
          <CheckModal />
          <AtTabs
            scroll
            current={selectTab}
            tabList={tabList}
            onClick={e => tabSwitchHandle(e)}>
            {noUnifiedList.includes(type) ? null : (
              <AtTabsPane
                current={selectTab}
                index={tabList.findIndex(val => val.title === '统一任务')}>
                <View style='background-color: #FAFBFC;'>
                  <AllIssueList
                    issuesItems={issue}
                    index={4}
                    setIsCheckModal={setIsCheckModal}
                    fresh={getTimeDetail}
                  />
                </View>
              </AtTabsPane>
            )}
            {noTwoType.includes(type) ? null : (
              <AtTabsPane
                current={selectTab}
                index={tabList.findIndex(val => val.title === '问题清单')}>
                <AllIssueList
                  problemsItem={problem}
                  index={1}
                  fresh={getTimeDetail}
                />
                {/* 问题清单 */}
              </AtTabsPane>
            )}
            {noTwoType.includes(type) ? null : (
              <AtTabsPane
                current={selectTab}
                index={tabList.findIndex(val => val.title === '协议清单')}>
                <AllIssueList
                  protocolsItem={protocol}
                  index={2}
                  fresh={getTimeDetail}
                />
                {/* 协议清单 */}
              </AtTabsPane>
            )}
            {type === 0 ? null : (
              <AtTabsPane
                current={selectTab}
                index={tabList.findIndex(val => val.title === '手续清单')}>
                <AllIssueList
                  proceduresItem={procedure}
                  index={3}
                  fresh={getTimeDetail}
                />
                {/* 手续清单 */}
              </AtTabsPane>
            )}
            {type === 3 || type === 2 ? (
              type === 2 ? (
                // 初设第一阶段中间检查要点
                <AtTabsPane
                  current={selectTab}
                  index={tabList.findIndex(
                    val => val.title === '初设第一阶段中间检查要点',
                  )}>
                  <Intermediate />
                </AtTabsPane>
              ) : (
                // 初设第二阶段中间检查要点
                <AtTabsPane
                  current={selectTab}
                  index={tabList.findIndex(
                    val => val.title === '初设第二阶段中间检查要点',
                  )}>
                  <Intermediate />
                </AtTabsPane>
              )
            ) : null}
            {type === 0 ? (
              //建设专业可研反馈记录表
              <AtTabsPane
                current={selectTab}
                index={tabList.findIndex(
                  val => val.title === '建设专业可研反馈记录表',
                )}>
                <View style='background-color: #FAFBFC;'>
                  <TechnologyTable />
                </View>
              </AtTabsPane>
            ) : null}
            {specialList.includes(type) ? (
              //专项评估
              <AtTabsPane
                current={selectTab}
                index={tabList.findIndex(val => val.title === '专项评估')}>
                <View style='50px;background-color: #FAFBFC;'></View>
                <SpecialAssessment Type={type} />
              </AtTabsPane>
            ) : null}
          </AtTabs>
        </View>
      )}
    </View>
  );
}
export default ProjectList;
