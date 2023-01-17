import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { View, Button } from '@tarojs/components';
import { AtMessage, AtIcon, AtInput, AtForm, AtModal } from 'taro-ui';
import { message } from '../../../../../../../common/index';
import httpUtil from '../../../../../../../utils/httpUtil';
import { technologyItem } from './technologyTableType';
import './technologyTable.module.css';

export const TechnologyTable: React.FC = () => {
  const Modal = AtModal;
  const Input = AtInput;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [recordList, setRecordList] = useState<technologyItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<number | null>(null);
  const [opinion, setOpinion] = useState<string | null>(null);
  const [situation, setSituation] = useState<string | null>(null);
  const [sheetId, setSheetId] = useState<number | null>(null);
  const projectId = Taro.getStorageSync('projectId')!;
  const progressId = Taro.getStorageSync('progressId')!;
  const titleList = ['审核意见', '闭环情况', '主要建议意见', '问题处置'];
  const parameterList = [
    'opinion',
    'situation',
    'mainAdviceOpinion',
    'questionExecute',
  ];

  const getTechnologyList = async () => {
    setIsLoading(true);
    try {
      // 这里是调试写死的数据
      // projectId,
      // progressId,
      const res = await httpUtil.getTechnologyList({
        // projectId: String(305),
        // progressId: String(2025),
        projectId,
        progressId,
      });
      if (res.code === 200) {
        setRecordList(res.data.list);
        setOpinion(res.data.主要建议意见);
        setSituation(res.data.问题处置);
        setSheetId(res.data.list[0].id);
        setIsLoading(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const showModal = (
    e: React.MouseEvent<HTMLViewElement, MouseEvent>,
    id: number | null,
  ) => {
    setCurrentTab(e.currentTarget.tabIndex);
    if (id) {
      setSheetId(id);
    }
    setIsModalVisible(true);
  };

  const onFinish = async (values: any) => {
    message('请求中', 'warning');
    try {
      const res = await httpUtil.updateSheet({
        progressId: Number(progressId),
        projectId: Number(projectId),
        sheetId: sheetId!,
        ...values,
      });
      if (res.code === 200) {
        getTechnologyList();
        handleOk();
        message('填写成功', 'success');
      }
    } finally {
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const setValue = (value: string, type: string) => {
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
  const ModalForm = () => {
    return (
      <Modal
        title={'填写' + titleList[currentTab!]}
        isOpened={isModalVisible}
        onConfirm={handleOk}
        onCancel={handleCancel}>
        <AtForm onSubmit={onFinish}>
          <Input
            title={titleList[currentTab!]}
            name={parameterList[currentTab!]}
            placeholder={`请输入${titleList[currentTab!]}`}
            value={parameterList[currentTab!]}
            onChange={e => setValue(parameterList[currentTab!], e)}></Input>
          <Button className='btn-background' formType='submit' type='primary'>
            确定
          </Button>
        </AtForm>
      </Modal>
    );
  };

  useEffect(() => {
    getTechnologyList();
  }, []);

  return (
    <View className='technologyTable-container'>
      <ModalForm />
      <View className='technologyTable-header'>
        <View>序号</View>
        <View>审核内容</View>
        <View>依据</View>
        <View>审核意见 (可研内审后填写)</View>
        <View>闭环情况 (可研批复会签前填写)</View>
      </View>
      <View className='technologyTable-table'>
        {recordList.length === 0 ? (
          <View className='technologyTable-empty'>
            <AtIcon value='bullet-list' size='196' color='#99bead'></AtIcon>
            <View className='technologyTable-empty-tip'>
              暂 无 专 业 可 研 反 馈 记 录
            </View>
          </View>
        ) : (
          <View className='technologyTable-lists'>
            {recordList.map((item, index) => {
              return (
                <View className='technologyTable-item' key={index}>
                  <View>{index + 1}</View>
                  <View>{item.审核内容}</View>
                  <View>{item.依据}</View>
                  <View
                    style={{
                      color: item.审核意见 === null ? '#cfcfcf' : 'black',
                    }}>
                    {item.审核意见 === null ? '暂未填写' : item.审核意见}
                  </View>
                  <View
                    style={{
                      color: item.闭环情况 === null ? '#cfcfcf' : 'black',
                    }}>
                    {item.闭环情况 === null ? '暂未填写' : item.闭环情况}
                  </View>
                </View>
              );
            })}
            <View className='signature-container'>
              <View className='signature-title'>
                <View>建管单位(部门)建议意见</View>
              </View>
              <View className='signature-input'>
                <View className='opinion'>
                  {/* <TextArea placeholder='主要建议意见：'></TextArea> */}
                  <View className='title'>主要建议意见：</View>
                  <View className='content'>
                    <View
                      className='all-content'
                      style={{ color: opinion === null ? '#cfcfcf' : 'black' }}>
                      {opinion === null ? '暂未填写' : opinion}
                    </View>
                  </View>
                </View>
                <View className='opinion'>
                  <View className='title'>问题处置：</View>
                  <View className='content'>
                    <View
                      className='all-content'
                      style={{
                        color: situation === null ? '#cfcfcf' : 'black',
                      }}>
                      {situation === null ? '暂未填写' : situation}
                    </View>
                  </View>
                  {/* <TextArea placeholder='问题处置：'></TextArea> */}
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
      <AtMessage />
    </View>
  );
};
