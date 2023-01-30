import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { View, Button } from '@tarojs/components';
import {
  AtMessage,
  AtIcon,
  AtInput,
  AtForm,
  AtModal,
  AtModalHeader,
  AtModalContent,
} from 'taro-ui';
import { message } from '../../../../../../../common/index';
import httpUtil from '../../../../../../../utils/httpUtil';
import { updateSheet, technologyModalProps } from './technologyTableType';
import './technologyTable.css';

const TechnologyModal: React.FC<technologyModalProps> = selfProps => {
  const { isTechModal, okTechModal, currentTab, getTechnologyList, sheetId } =
    selfProps;
  const [tmp, setTmp] = useState<string | null>(null);
  const [opinion, setOpinion] = useState<string | null>(null);
  const [situation, setSituation] = useState<string | null>(null);
  const ModalName = Taro.getStorageSync('ModalName')!;
  const projectId = Taro.getStorageSync('projectId')!;
  const progressId = Taro.getStorageSync('progressId')!;
  const titleList = ['审核意见', '闭环情况', '主要建议意见', '问题处置'];
  const parameterList = [
    'opinion',
    'situation',
    'mainAdviceOpinion',
    'questionExecute',
  ];
  const onFinish = async () => {
    message('请求中', 'warning');
    const values = {
      projectId: Number(projectId),
      progressId: Number(progressId),
      sheetId: sheetId,
    };
    if (!opinion) values['opinion'] = tmp;
    if (!situation) values['opinion'] = tmp;
    console.log(values);
    try {
      const res = await httpUtil.updateSheet(values as updateSheet);
      if (res.code === 200) {
        getTechnologyList();
        okTechModal();
        message('填写成功', 'success');
      } else {
        getTechnologyList();
        okTechModal();
        message('请求出错', 'error');
      }
    } finally {
    }
  };
  const setValue = (type: string, value: string) => {
    setTmp(value);
    switch (type) {
      case 'opinion':
        setOpinion(value);
        break;
      case 'situation':
        setSituation(value);
        break;
      case 'mainAdviceOpinion':
        setOpinion(value);
        break;
      case 'questionExecute':
        setSituation(value);
        break;
    }
  };
  return (
    <AtModal
      isOpened={isTechModal}
      onClose={okTechModal}
      onCancel={okTechModal}>
      <AtModalHeader>{'填写' + titleList[currentTab!]}</AtModalHeader>
      <AtModalContent>
        <AtForm onSubmit={onFinish}>
          <AtInput
            focus
            title={titleList[currentTab!]}
            name={parameterList[currentTab!]}
            placeholder={`请输入${titleList[currentTab!]}`}
            value={tmp as string}
            onChange={e =>
              setValue(parameterList[currentTab!], e as string)
            }></AtInput>
          <Button className='btn-background' formType='submit' type='primary'>
            确定
          </Button>
        </AtForm>
      </AtModalContent>
    </AtModal>
  );
};

export default TechnologyModal;
