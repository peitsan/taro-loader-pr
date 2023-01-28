import { message, transPersons } from '@/common/functions';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { AtTabs, AtTabsPane, AtTag } from 'taro-ui';
import httpUtil from '../../../../../utils/httpUtil';
import ThreeListQuestionAuditTable from './component/ThreeListQuestionAuditTable';
import { getUnitsAC } from '../../../../../redux/actionCreators';
import { useDispatch, useSelector } from '../../../../../redux/hooks';
import styles from './index.module.less';

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
  const { router } = Taro.getCurrentInstance(); //获取路由传入的index参数
  const dispatch = useDispatch();
  const project_id = router?.params.project_id!;
  const fatherId = router?.params.fatherId! as string;
  const fatherProjectName = router?.params.fatherProjectName! as string;
  // 当前页（问题清单 手续清单 协议清单）
  const [curPage, setCurPage] = useState(0);
  const [dataArr, setDataArr] = useState<any[] | null>(null);
  // 控制modal显示
  const [visible, setVisible] = useState(false);
  const [expandedRow, setExpandedRow] = useState<any[]>([]);
  // 人员列表
  const units = useSelector(state => state.units.data.units);
  const searchUnits = useSelector(state => state.units.data.searchUnits);

  // 通过三个清单的问题
  const onCreate = (values: any) => {
    const valueArr: any[] = Object.values(values);
    const sendData: SendDataType = {};
    let num = 0;

    for (let item of expandedRow) {
      const id = item.id;
      sendData[id] = {};
      sendData[id]['planTime'] = new Date(valueArr[num]).valueOf();
      // 根据新接口待修改
      const responsibles: number | unknown[] = transPersons(
        valueArr[num + 1],
        searchUnits,
      );
      const relevantors: number | unknown[] = transPersons(
        valueArr[num + 2],
        searchUnits,
      );
      sendData[id]['responsibles'] = responsibles;
      sendData[id]['relevantors'] = relevantors;
      sendData[id]['advanceDay'] = valueArr[num + 3];
      num += 4;
    }
    const curListName = threeListName[curPage];

    const threeMap = ['problemId', 'protocolId', 'procedureId'];
    const problem_id = expandedRow[0][threeMap[curPage]];
    message('请求中', 'warning');
    httpUtil
      .passThreeListItem({
        itemName: curListName,
        problem_id,
        project_id,
        sendData,
      })
      .then(res => {
        if (res.code === 200) {
          message('成功', 'success');
          getThreeList();
          setVisible(false);
        } else {
          message(res.message, 'error');
        }
      });
  };

  const getThreeList = () => {
    httpUtil.getUncheckedProjectQuestion({ project_id }).then(res => {
      const {
        data: { problems, protocols, procedures },
      } = res;
      setDataArr([problems, protocols, procedures]);
    });
  };

  useEffect(() => {
    dispatch(getUnitsAC({ fatherId }));
    getThreeList();
  }, []);
  return (
    <>
      <View className={styles.top}>
        <AtTag className={styles.tag} circle>
          项目清单
        </AtTag>
        <View className='project-title'>
          {fatherProjectName}/{projectName}
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
              problemsItem={problem}
              index={1}
              fresh={getTimeDetail}
            />
            {/* 问题清单 */}
          </AtTabsPane>
          <AtTabsPane
            current={selectTab}
            index={tabList.findIndex(val => val.title === '协议清单')}>
            <ThreeListQuestionAuditTable
              protocolsItem={protocol}
              index={2}
              fresh={getTimeDetail}
            />
            {/* 协议清单 */}
          </AtTabsPane>
          <AtTabsPane
            current={selectTab}
            index={tabList.findIndex(val => val.title === '手续清单')}>
            <ThreeListQuestionAuditTable
              proceduresItem={procedure}
              index={3}
              fresh={getTimeDetail}
            />
            {/* 手续清单 */}
          </AtTabsPane>
        </AtTabs>
      </View>
    </>
  );
};
export default Index;
