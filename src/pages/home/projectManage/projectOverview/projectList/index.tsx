import Taro from '@tarojs/taro';
import { useDispatch, useSelector } from '@/redux/hooks';
import { getUnitsAC } from '@/redux/actionCreators';
import PopConfirm from '@/common/components/PopConfirm';
import { Item } from '@/common/components/Accordion/indexProps';
import { useState, useEffect, useRef } from 'react';
import {
  AtIcon,
  AtLoadMore,
  AtMessage,
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
  PreProcedure,
} from './components';
import httpUtil from '../../../../../utils/httpUtil';
import {
  issuesItem,
  problemsItem,
  proceduresItem,
  protocolsItem,
  tabListItem,
  TechRefProps,
} from './projectListType/projectListType';
import { message } from '../../../../../common/index';
import ApplyUpper from './components/applyUpper';
import SelectResponsible from './components/selectResponsible';
import AdjustDeadline from './components/AdjustDeadline';
import ReplyQuestion from './components/replyQuestion';
import FillTechnology from './components/technologyTable/technologyModal';
import { ModalAttachmentComponent } from '../components';
import './index.less';

function ProjectList() {
  const dispatch = useDispatch();
  const projectName = Taro.getStorageSync('projectName');
  const progressName = Taro.getStorageSync('name');
  const fatherName = Taro.getStorageSync('fatherName');
  const type = Number(Taro.getStorageSync('type'));
  const fatherId = Taro.getStorageSync('fatherId');
  const itemName = ['reason', 'opinion', 'condition', 'question'];
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
  // 缓存专项评估数据
  const [zxpgData, setZxpgData] = useState<any>();
  // 暂存获取选中数据
  const [selectRecord, setSelectRecord] = useState();
  const [selectIndex, setSelectIndex] = useState<number>();
  // 控制指定负责人模态框
  const [isManageModal, setIsManageModal] = useState<boolean>(false);
  // 控制申请调整时间模态框
  const [isAdjustModal, setIsAdjustModal] = useState<boolean>(false);
  // 控制可研技术收口模态框
  const [isTechModal, setIsTechModal] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<number>();
  const [sheetId, setSheetId] = useState<number | null>(null);
  const TechRef = useRef<TechRefProps>();
  // 控制员工回复清单问题
  const [isReplyModal, setIsReplyModal] = useState<boolean>(false);
  // 控制上报领导
  const [isApplyUpper, setIsApplyUpper] = useState<boolean>(false);
  // 员工列表
  const units = useSelector(state => state.units.data.units);
  const searchUnits = useSelector(state => state.units.data.searchUnits);
  const [isDolShow, setIsDolShow] = useState(false);
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
  const specialList = [1, 2, 3, 4, 8, 20, 21, 22];
  // 前期手续
  const hasPreliminaryProcedure = [20, 21, 22];

  // 这里注释了取项目id的请求体
  const getTimeDetail = async () => {
    try {
      const res = await httpUtil.getProjectProgressDetail({
        project_id: String(Taro.getStorageSync('projectId')),
        progress_id: String(Taro.getStorageSync('progressId')),
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
  const flush = (flsh: boolean) => {
    setFlag(flsh);
  };
  //监听Tab页切换事件
  const tabSwitchHandle = (val: number) => {
    setSelectTab(val);
  };
  //动态鉴权生成Tab标签
  const effectTabList = () => {
    const TabList: tabListItem[] = [
      { title: '统一任务' },
      { title: '问题清单' },
      { title: '协议清单' },
      { title: '手续清单' },
      { title: '初设第一阶段中间检查要点' },
      { title: '初设第二阶段中间检查要点' },
      { title: '建设专业可研反馈记录表' },
      { title: '前期手续' },
      { title: '中间成果评审会检查要点' },
      { title: '市公司内审前检查检查要点' },
      { title: '专项评估' },
    ];
    //无前期手续的splice
    if (type != 21) {
      TabList.splice(
        TabList.findIndex(val => val.title === '中间成果评审会检查要点'),
        1,
      );
    }
    //无前期手续的splice
    if (type != 22) {
      TabList.splice(
        TabList.findIndex(val => val.title === '市公司内审前检查检查要点'),
        1,
      );
    }
    //无前期手续的splice
    if (!hasPreliminaryProcedure.includes(type)) {
      TabList.splice(
        TabList.findIndex(val => val.title === '前期手续'),
        1,
      );
    }
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
  //关闭查看清单回复模态框
  const okCheckModal = () => {
    setIsCheckModal(false);
  };
  // 查看清单模态框
  const CheckModal: React.FC = () => {
    let reply = '回复为空';
    let URL = '';
    if (selectRecord) {
      URL = selectRecord.attachment;
      reply = selectRecord.text;
    }
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
              height={50}
              value={selectRecord ? selectRecord.text : ''}
              onChange={e => setReplyText(e)}
            />
            <View className='reply-title'>附件：</View>
            <View className='reply-files'>
              {URL == '' ? (
                <View style={{ color: 'silver' }}>
                  <AtIcon value='file-generic' size='30' color='#797979' />
                  无附件
                </View>
              ) : (
                <View
                  onClick={() => {
                    setIsDolShow(true);
                  }}>
                  <AtIcon value='file-generic' size='30' color='#51796f' />
                  下载附件
                </View>
              )}
              <ModalAttachmentComponent
                isShow={isDolShow}
                setIsShow={setIsDolShow}
                url={URL}
                titleName='回复内容附件'
              />
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
  //关闭指定负责人模态框
  const okManageModal = () => {
    getTimeDetail();
    setIsManageModal(false);
  };
  //关闭申请调整时间模态框
  const okAdjustModal = () => {
    getTimeDetail();
    setIsAdjustModal(false);
  };
  //关闭可研技术收口填写模态框
  const okTechModal = () => {
    getTimeDetail();
    setIsTechModal(false);
  };
  //关闭可研技术收口填写模态框
  const okReplyModal = () => {
    getTimeDetail();
    setIsReplyModal(false);
  };
  //关闭选择领导上报模态框
  const okApplyUpper = () => {
    getTimeDetail();
    setIsApplyUpper(false);
  };

  const [isRejetModal, setIsRejetModal] = useState<boolean>(false);
  const [isPassModal, setIsPassModal] = useState<boolean>(false);
  const okPassModal = () => {
    getTimeDetail();
    setIsPassModal(false);
  };
  const okRejetModal = () => {
    getTimeDetail();
    setIsRejetModal(false);
  };
  const pass = (question_id: string) => {
    message('请求中', 'warning');
    httpUtil
      .passReplyApprove({
        project_id: String(Taro.getStorageSync('projectId')),
        question_id: question_id,
        itemName: itemName[(selectIndex as number) - 1],
      })
      .then(res => {
        if (res.code === 200) {
          message('通过成功', 'success');
        } else {
          message('通过失败', 'error');
        }
      });
  };
  const passSpecial = () => {
    message('请求中', 'warning');
    let approvalId = 0;
    zxpgData.map(item => {
      if (item.id == selectRecord.id) {
        const { aid, bid, cid, eid, did } = item;
        const idList = ['', aid, bid, cid, did, '', '', '', eid];
        approvalId = idList[type];
      }
    });
    httpUtil
      .specialPass({
        projectId: String(Taro.getStorageSync('projectId')),
        zxpgId: approvalId,
      })
      .then(res => {
        if (res.code === 200) {
          message('通过成功', 'success');
        } else {
          message('通过失败', 'error');
        }
      });
  };
  const reject = (question_id: string) => {
    message('请求中', 'warning');
    httpUtil
      .backReplyApprove({
        project_id: String(Taro.getStorageSync('projectId')),
        question_id: question_id,
        itemName: itemName[(selectIndex as number) - 1],
      })
      .then(res => {
        if (res.code === 200) {
          message('驳回成功', 'success');
        } else {
          message('驳回失败', 'error');
        }
      });
  };
  const rejectSpecial = () => {
    message('请求中', 'warning');
    let approvalId = 0;
    zxpgData.map(item => {
      if (item.id == selectRecord.id) {
        const { aid, bid, cid, eid, did } = item;
        const idList = ['', aid, bid, cid, did, '', '', '', eid];
        approvalId = idList[type];
      }
    });
    httpUtil
      .specialReject({
        projectId: String(Taro.getStorageSync('projectId')),
        zxpgId: approvalId,
      })
      .then(res => {
        if (res.code === 200) {
          message('驳回成功', 'success');
        } else {
          message('驳回失败', 'error');
        }
      });
  };
  const onConfirmPass = () => {
    if (selectRecord !== null && selectIndex !== 7)
      pass((selectRecord as Item).key as string);
    else if (selectRecord !== null && selectIndex == 7) {
      passSpecial();
    }
    okPassModal();
  };
  const onConfirmReject = () => {
    if (selectRecord !== null && selectIndex !== 7)
      reject((selectRecord as Item).key as string);
    else if (selectRecord !== null && selectIndex == 7) {
      rejectSpecial();
    }
    okRejetModal();
  };
  useEffect(() => {
    dispatch(getUnitsAC({ fatherId: fatherId, getTeamPerson: true }));
    getTimeDetail();
    // 生成tabList
    effectTabList();
  }, [flag, fresh]);
  return (
    <View className='projectView-container'>
      <AtMessage />
      <View className='project-title'>
        {fatherName}/{projectName}/{progressName}
      </View>
      {/* <BackPrePage /> */}
      <View className='projectView-title-wrp'>
        {(selectTab == tabList.findIndex(val => val.title === '问题清单') ||
          selectTab == tabList.findIndex(val => val.title === '手续清单') ||
          selectTab == tabList.findIndex(val => val.title === '协议清单') ||
          selectTab == tabList.findIndex(val => val.title === '前期手续')) &&
        Taro.getStorageSync('ModalName') === 'projectOverview' &&
        !JSON.parse(Taro.getStorageSync('progress')) ? (
          <View
            className='projectModel-container'
            style={{ position: 'absolute', right: '30px', top: '10px' }}>
            <ProjectModel
              flushFunction={flush}
              selectList={tabList[selectTab].title}
            />
            {/* 前期手续新增页面要修改只有2个字段 */}
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
          {/* 填报查看回复清单 */}
          <CheckModal />
          {/* 指定负责人 */}
          <SelectResponsible
            zxpgData={zxpgData}
            isManageModal={isManageModal}
            okManageModal={okManageModal}
            selectRecord={selectRecord}
            selectIndex={selectIndex as number}
            units={units}
          />
          {/* 申请调整时间 */}
          <AdjustDeadline
            isAdjustModal={isAdjustModal}
            okAdjustModal={okAdjustModal}
            selectRecord={selectRecord}
            selectIndex={selectIndex as number}
          />
          {/* 填写可研技术收口 */}
          <FillTechnology
            getTechnologyList={TechRef.current?.getList as Function}
            isTechModal={isTechModal}
            okTechModal={okTechModal}
            setCurrentTab={setCurrentTab}
            sheetId={sheetId}
            currentTab={currentTab}
          />
          {/* 员工回复清单问题 */}
          <ReplyQuestion
            isReplyModal={isReplyModal}
            okReplyModal={okReplyModal}
            selectIndex={selectIndex as number}
            selectRecord={selectRecord}
          />
          {/* 通过审核 */}
          <PopConfirm
            isPop={isPassModal}
            okIsPop={okPassModal}
            operation='通过'
            msg='确认通过前请查看回复信息!确认后将无法撤回！'
            todo={onConfirmPass}
          />
          {/* 驳回审核 */}
          <PopConfirm
            isPop={isRejetModal}
            okIsPop={okRejetModal}
            operation='驳回'
            msg='驳回通过前请查看回复信息!确认后将无法撤回！'
            todo={onConfirmReject}
          />
          {/* 上报审批 */}
          <ApplyUpper
            isApplyUpper={isApplyUpper}
            okApplyUpper={okApplyUpper}
            selectIndex={selectIndex as number}
            selectRecord={selectRecord}
            zxpgData={zxpgData}
            units={units}
          />
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
                    setIsApplyUpper={setIsApplyUpper}
                    setIsPassModal={setIsPassModal}
                    setIsRejetModal={setIsRejetModal}
                    setIsReplyModal={setIsReplyModal}
                    setIsCheckModal={setIsCheckModal}
                    setIsManageModal={setIsManageModal}
                    setIsAdjustModal={setIsAdjustModal}
                    setSelectRecord={setSelectRecord}
                    setSelectIndex={setSelectIndex}
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
                  setIsApplyUpper={setIsApplyUpper}
                  setIsPassModal={setIsPassModal}
                  setIsRejetModal={setIsRejetModal}
                  setIsReplyModal={setIsReplyModal}
                  setIsCheckModal={setIsCheckModal}
                  setIsManageModal={setIsManageModal}
                  setIsAdjustModal={setIsAdjustModal}
                  setSelectRecord={setSelectRecord}
                  setSelectIndex={setSelectIndex}
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
                  setIsApplyUpper={setIsApplyUpper}
                  setIsPassModal={setIsPassModal}
                  setIsRejetModal={setIsRejetModal}
                  setIsReplyModal={setIsReplyModal}
                  setIsCheckModal={setIsCheckModal}
                  setIsManageModal={setIsManageModal}
                  setIsAdjustModal={setIsAdjustModal}
                  setSelectRecord={setSelectRecord}
                  setSelectIndex={setSelectIndex}
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
                  setIsApplyUpper={setIsApplyUpper}
                  setIsPassModal={setIsPassModal}
                  setIsRejetModal={setIsRejetModal}
                  setIsReplyModal={setIsReplyModal}
                  setIsCheckModal={setIsCheckModal}
                  setIsManageModal={setIsManageModal}
                  setIsAdjustModal={setIsAdjustModal}
                  setSelectRecord={setSelectRecord}
                  setSelectIndex={setSelectIndex}
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
                  <TechnologyTable
                    ref={TechRef}
                    setSheetId={setSheetId}
                    isTechModal={isTechModal}
                    setIsTechModal={setIsTechModal}
                    setSelectRecord={setSelectRecord}
                    setCurrentTab={setCurrentTab}
                  />
                </View>
              </AtTabsPane>
            ) : null}
            {hasPreliminaryProcedure.includes(type) ? (
              //前期手续
              <AtTabsPane
                current={selectTab}
                index={tabList.findIndex(val => val.title === '前期手续')}>
                <View style='background-color: #FAFBFC;'>
                  <PreProcedure data={issue} />
                </View>
              </AtTabsPane>
            ) : null}
            {type === 21 ? (
              <AtTabsPane
                current={selectTab}
                index={tabList.findIndex(
                  val => val.title === '中间成果评审会检查要点',
                )}>
                <View style='background-color: #FAFBFC;'>
                  <Intermediate />
                </View>
              </AtTabsPane>
            ) : null}
            {type === 22 ? (
              <AtTabsPane
                current={selectTab}
                index={tabList.findIndex(
                  val => val.title === '市公司内审前检查检查要点',
                )}>
                <View style='background-color: #FAFBFC;'>
                  <Intermediate />
                </View>
              </AtTabsPane>
            ) : null}
            {specialList.includes(type) ? (
              //专项评估
              <AtTabsPane
                current={selectTab}
                index={tabList.findIndex(val => val.title === '专项评估')}>
                {/* <View style='50px;background-color: #FAFBFC;'></View> */}
                <SpecialAssessment
                  Type={type}
                  setZxpgData={setZxpgData}
                  setIsApplyUpper={setIsApplyUpper}
                  setIsPassModal={setIsPassModal}
                  setIsRejetModal={setIsRejetModal}
                  setIsReplyModal={setIsReplyModal}
                  setIsCheckModal={setIsCheckModal}
                  setIsManageModal={setIsManageModal}
                  setIsAdjustModal={setIsAdjustModal}
                  setSelectRecord={setSelectRecord}
                  setSelectIndex={setSelectIndex}
                  fresh={getTimeDetail}
                />
              </AtTabsPane>
            ) : null}
          </AtTabs>
        </View>
      )}
    </View>
  );
}
export default ProjectList;
