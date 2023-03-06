import { getStorageSync } from '@tarojs/taro';
import { useRef, useState } from 'react';
import {
  AtInputNumber,
  AtModal,
  AtModalAction,
  AtModalContent,
  AtModalHeader,
} from 'taro-ui';
import { Button, View } from '@tarojs/components';
import { UnitsType } from '@/redux/units/slice';
import PersonSelector from '@/common/components/personSelector/personSelector';
import { message } from '@/common/functions';
import httpUtil from '@/utils/httpUtil';
import { SelectResponsibleProps } from './indexProps';
import styles from './index.module.less';

const SelectResponsible: React.FC<SelectResponsibleProps> = selfProps => {
  const {
    isManageModal,
    okManageModal,
    selectRecord,
    units,
    selectIndex,
    zxpgData,
  } = selfProps;
  const ResponserVal = useRef<any>();
  const AlerterVal = useRef<any>();
  const [AlertDeadline, setAlertDeadline] = useState<number>(10);

  const onCreate = () => {
    message('请求中', 'warning');
    if (selectIndex !== 7) {
      httpUtil
        .comfirmResponsible({
          project_id: getStorageSync('projectId'),
          question_id: selectRecord.key,
          relevantors: [
            units[ResponserVal?.current?.state.value[0]]?.depts[
              ResponserVal?.current?.state.value[1]
            ]?.workers[ResponserVal?.current?.state.value[2]]?.id,
          ],
          responsibles: [
            units[AlerterVal?.current?.state.value[0]]?.depts[
              AlerterVal?.current?.state.value[1]
            ]?.workers[AlerterVal?.current?.state.value[2]]?.id,
          ],
          advanceDay: AlertDeadline,
        })
        .then(res => {
          if (res.code === 500) {
            message('请求错误', 'error');
            okManageModal();
          } else {
            message('请求中', 'warning');
            message('指定成功', 'success');
            okManageModal();
          }
        });
    } else {
      let kid = 0;
      const type = Number(getStorageSync('type'));
      zxpgData.map(item => {
        if (item.id == selectRecord.id) {
          const { aid, bid, cid, eid, did } = item;
          const idList = ['', aid, bid, cid, did, '', '', '', eid];
          if (type < 20) {
            kid = idList[type];
          } else {
            kid = idList[type - 20];
          }
        }
      });
      httpUtil
        .specialChooseResponsible({
          projectId: getStorageSync('projectId'),
          zxpgId: kid,
          relevantors: [
            units[ResponserVal?.current?.state.value[0]]?.depts[
              ResponserVal?.current?.state.value[1]
            ]?.workers[ResponserVal?.current?.state.value[2]]?.id,
          ],
          responsibles: [
            units[AlerterVal?.current?.state.value[0]]?.depts[
              AlerterVal?.current?.state.value[1]
            ]?.workers[AlerterVal?.current?.state.value[2]]?.id,
          ],
          advanceDay: AlertDeadline,
        })
        .then(res => {
          if (res.code === 500) {
            message('请求错误', 'error');
            okManageModal();
          } else {
            okManageModal();
            message('请求中', 'warning');
            message('指定成功', 'success');
          }
        });
    }
  };
  const onConfirmManage = () => {
    onCreate();
  };
  // 人员好像数据不太对
  return (
    <AtModal isOpened={isManageModal} onClose={okManageModal}>
      <AtModalHeader> 确认责任人-报警人</AtModalHeader>
      <AtModalContent>
        {selectIndex === 7 ? (
          <></>
        ) : (
          <View className={styles['reply-title']}>
            {selectRecord?.reason + ':'}
          </View>
        )}
        <View>
          <PersonSelector
            title='负责人'
            ref={ResponserVal}
            data={units as UnitsType}
            placeholder='请选择负责人'
            width={354}
            multiple
          />
        </View>
        <View>
          <PersonSelector
            title='报警人'
            ref={AlerterVal}
            data={units as UnitsType}
            placeholder='请选择报警人'
            width={354}
            multiple
          />
        </View>
        {isManageModal ? (
          <View className={styles['reply-title']}>
            提前提醒天数:{' '}
            <AtInputNumber
              min={1}
              max={30}
              step={1}
              value={AlertDeadline}
              onChange={e => setAlertDeadline(e)}
            />
          </View>
        ) : null}
      </AtModalContent>
      <AtModalAction>
        {' '}
        <Button onClick={okManageModal}>取消</Button>
        <Button onClick={onConfirmManage}>确定</Button>{' '}
      </AtModalAction>
    </AtModal>
  );
};

export default SelectResponsible;
