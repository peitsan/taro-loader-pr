import { message, transPersons } from '@/common/functions';
import { View } from '@tarojs/components';
import PopConfirm from '@/common/components/PopConfirm';
import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { AtMessage, AtTabs, AtTabsPane, AtTag } from 'taro-ui';
import httpUtil from '../../../../../utils/httpUtil';
import ThreeListQuestionAuditTable from './component/ThreeListQuestionAuditTable';
import AdjustDeadLine from './component/adjustDeadLine';
import { getUnitsAC } from '../../../../../redux/actionCreators';
import { useDispatch, useSelector } from '../../../../../redux/hooks';
import styles from './index.module.less';
import { tabListItem } from './indexProps';
import SelectResponsible from './component/selectResponsible';

export const pageIndexTitles = ['原因', '意见', '条件'];
export const threeListName = ['problem', 'protocol', 'procedure'];

export const getPreTitle = (
  pageIndexTitle: string[],
  curPage: number,
  index: number,
) => {
  return `${pageIndexTitle[curPage]} ${index + 1}`;
};

interface SendDataType {
  [propName: string]: {
    [propName: string]: any;
  };
}

const Index: React.FC = () => {
  const projectName = Taro.getStorageSync('projectName');
  const fatherName = Taro.getStorageSync('fatherName');
  const fatherId = Taro.getStorageSync('fatherId');
  const projectId = Taro.getStorageSync('projectId');
  const [selectTab, setSelectTab] = useState<number>(0);
  const [dataArr, setDataArr] = useState<any>([]);
  const [selectRecord, setSelectRecord] = useState<any>([]);
  const [isAssignResponsibilities, setIsAssignResponsibilities] =
    useState<boolean>(false);
  const [isRejectModal, setIsRejectModal] = useState<boolean>(false);
  const dispatch = useDispatch();
  // 人员列表
  const units = useSelector(state => state.units.data.units);
  const searchUnits = useSelector(state => state.units.data.searchUnits);

  // Tab标签
  const tabList: tabListItem[] = [
    { title: '问题清单' },
    { title: '协议清单' },
    { title: '手续清单' },
  ];
  const okRejectModal = () => {
    setIsRejectModal(false);
  };
  const okAssignResponsibilities = () => {
    setIsAssignResponsibilities(false);
  };
  // 切换标签页
  const tabSwitchHandle = (val: number) => {
    setSelectTab(val);
  };

  // 拒绝三个问题的清单
  const onConfirmReject = () => {
    message('请求中', 'warning');
    httpUtil
      .backThreeListItem({
        itemName: threeListName[selectTab],
        problem_id: selectRecord.id,
        project_id: projectId,
      })
      .then(res => {
        message('驳回成功', 'success');
        getThreeList();
        okRejectModal();
      });
  };
  const getThreeList = () => {
    httpUtil
      .getUncheckedProjectQuestion({ project_id: projectId })
      .then(res => {
        console.log(res);
        setDataArr(res.data);
      });
  };

  useEffect(() => {
    dispatch(getUnitsAC({ fatherId }));
    getThreeList();
    console.log(dataArr);
  }, []);
  return (
    <>
      {/* 驳回审核 */}
      <PopConfirm
        isPop={isRejectModal}
        okIsPop={okRejectModal}
        operation='驳回'
        msg='驳回通过前请查看新建清单信息!确认后将无法撤回！'
        todo={onConfirmReject}
      />
      {/* 指定负责人 */}
      <SelectResponsible
        isManageModal={isAssignResponsibilities}
        okManageModal={okAssignResponsibilities}
        selectRecord={selectRecord}
        recordFlash={getThreeList}
        selectIndex={selectTab}
        units={units}
      />
      <View className={styles.top}>
        <AtTag className={styles.tag} circle>
          项目清单
        </AtTag>
        <View className='project-title'>
          {fatherName}/{projectName}
        </View>
      </View>
      <View>
        <AtTabs
          scroll
          current={selectTab}
          tabList={tabList}
          onClick={e => tabSwitchHandle(e)}>
          <AtTabsPane
            current={selectTab}
            index={tabList.findIndex(val => val.title === '问题清单')}>
            <ThreeListQuestionAuditTable
              problemsItem={dataArr.problems}
              setIsAssignResponsibilities={setIsAssignResponsibilities}
              setIsRejectModal={setIsRejectModal}
              setSelectRecord={setSelectRecord}
              index={1}
              fresh={getThreeList}
            />
            {/* 问题清单 */}
          </AtTabsPane>
          <AtTabsPane
            current={selectTab}
            index={tabList.findIndex(val => val.title === '协议清单')}>
            <ThreeListQuestionAuditTable
              protocolsItem={dataArr.protocols}
              setIsAssignResponsibilities={setIsAssignResponsibilities}
              setIsRejectModal={setIsRejectModal}
              setSelectRecord={setSelectRecord}
              index={2}
              fresh={getThreeList}
            />
            {/* 协议清单*/}
          </AtTabsPane>
          <AtTabsPane
            current={selectTab}
            index={tabList.findIndex(val => val.title === '手续清单')}>
            <ThreeListQuestionAuditTable
              proceduresItem={dataArr.procedures}
              setIsAssignResponsibilities={setIsAssignResponsibilities}
              setIsRejectModal={setIsRejectModal}
              setSelectRecord={setSelectRecord}
              index={3}
              fresh={getThreeList}
            />
            {/* 手续清单*/}
          </AtTabsPane>
        </AtTabs>
        <AtMessage />
      </View>
    </>
  );
};
export default Index;
