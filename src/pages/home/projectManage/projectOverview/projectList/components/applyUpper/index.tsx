import { getStorageSync } from '@tarojs/taro';
import { useRef } from 'react';
import { AtModal, AtModalAction, AtModalContent, AtModalHeader } from 'taro-ui';
import { Button, View } from '@tarojs/components';
import { message } from '@/common/functions';
import httpUtil from '@/utils/httpUtil';
import PersonSelector from '@/common/components/personSelector/personSelector';
import { UnitsType } from '@/redux/managers/slice';
import { applyUpperProps } from './indexProps';

const ApplyUpper: React.FC<applyUpperProps> = selfProps => {
  const {
    isApplyUpper,
    okApplyUpper,
    selectRecord,
    selectIndex,
    units,
    zxpgData,
  } = selfProps;
  const UpperManager = useRef<any>();
  const onCreate = () => {
    let timer: NodeJS.Timer;
    const reply = ['reason', 'opinion', 'condition', 'question'];
    if (selectIndex !== 7) {
      timer = setTimeout(async () => {
        message('请求中', 'warning');
        try {
          const res = await httpUtil.managerSubmitQuestionTimeApply({
            project_id: getStorageSync('projectId'),
            question_id: selectRecord.key,
            responsibleId:
              units[UpperManager?.current?.state.value[0]]?.depts[
                UpperManager?.current?.state.value[1]
              ]?.workers[UpperManager?.current?.state.value[2]]?.id,
            itemName: reply[selectIndex - 1],
          });
          if (res.code === 200) {
            message('上报成功', 'success');
          } else if (res.code === 500) {
            message('请求错误', 'error');
          }
        } finally {
        }
      }, 500);
    } else {
      let approvalId = 0;
      zxpgData.map(item => {
        if (item.id == selectRecord.id) {
          const { aid, bid, cid, eid, did } = item;
          const idList = ['', aid, bid, cid, did, '', '', '', eid];
          approvalId = idList[getStorageSync('type')];
        }
      });
      timer = setTimeout(async () => {
        message('请求中', 'warning');
        try {
          const res = await httpUtil.specialReport({
            projectId: getStorageSync('projectId'),
            questionId: approvalId,
            responsibleId:
              units[UpperManager?.current?.state.value[0]]?.depts[
                UpperManager?.current?.state.value[1]
              ]?.workers[UpperManager?.current?.state.value[2]]?.id,
          });
          if (res.code === 200) {
            message('上报成功', 'success');
          } else if (res.code === 500) {
            message('请求错误', 'error');
          }
        } finally {
        }
      }, 500);
    }
  };
  const onConfirmApply = () => {
    onCreate();
    okApplyUpper();
  };
  return (
    <AtModal isOpened={isApplyUpper} onClose={okApplyUpper}>
      <AtModalHeader>选择上报领导</AtModalHeader>
      <AtModalContent>
        <View>
          <PersonSelector
            title='上报领导'
            ref={UpperManager}
            data={units as UnitsType}
            placeholder='请选择领导'
            width={354}
            multiple
          />
        </View>
      </AtModalContent>
      <AtModalAction>
        {' '}
        <Button onClick={okApplyUpper}>取消</Button>
        <Button onClick={onConfirmApply}>确定</Button>{' '}
      </AtModalAction>
    </AtModal>
  );
};

export default ApplyUpper;
