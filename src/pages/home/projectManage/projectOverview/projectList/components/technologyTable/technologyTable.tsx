import {
  Empty,
  SpinLoading,
  Modal,
  Input,
  Form,
  Button,
  message,
  TextArea,
} from 'antd-mobile';
import React, { useEffect, useState } from 'react';
import styles from './technologyTable.module.css';
import httpUtil from '../../../../../../../utils/httpUtil';
import { technologyList, technologyItem } from './technologyTableType';

export const TechnologyTable: React.FC = () => {
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
      const res = await httpUtil.getTechnologyList({
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
    }
  };

  const showModal = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: number | null,
  ) => {
    setCurrentTab(e.currentTarget.tabIndex);
    if (id) {
      setSheetId(id);
    }
    setIsModalVisible(true);
  };

  const onFinish = async (values: any) => {
    message.loading('请求中');
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
        message.destroy();
        message.success('填写成功');
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

  const ModalForm = () => {
    return (
      <Modal
        title={'填写' + titleList[currentTab!]}
        footer={null}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}>
        <Form onFinish={onFinish} autoComplete='off'>
          <Form.Item
            label={titleList[currentTab!]}
            name={parameterList[currentTab!]}
            rules={[
              {
                required: true,
                message: `请输入${titleList[currentTab!]}`,
              },
            ]}>
            <Input></Input>
          </Form.Item>
          <Form.Item>
            <Button
              className={styles['btn-background']}
              htmlType='submit'
              block
              type='primary'>
              确定
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  useEffect(() => {
    getTechnologyList();
  }, []);

  return (
    <div className={styles['technologyTable-container']}>
      <ModalForm />
      <div className={styles['technologyTable-table']}>
        <div className={styles['technologyTable-header']}>
          <div>序号</div>
          <div>审核内容</div>
          <div>依据</div>
          <div>审核意见(可研内审后填写)</div>
          <div>闭环情况(可研批复会签前填写)</div>
        </div>
        {isLoading ? (
          <div className={styles['example']}>
            <SpinLoading />
          </div>
        ) : recordList.length === 0 ? (
          <div className={styles['technologyTable-empty']}>
            <Empty />
          </div>
        ) : (
          <>
            {recordList.map((item, index) => {
              return (
                <div className={styles['technologyTable-item']} key={index}>
                  <div>{index + 1}</div>
                  <div>{item.审核内容}</div>
                  <div>{item.依据}</div>
                  <div
                    style={{
                      color: item.审核意见 === null ? '#cfcfcf' : 'black',
                    }}>
                    {item.审核意见 === null ? '暂未填写' : item.审核意见}
                  </div>
                  <div
                    style={{
                      color: item.闭环情况 === null ? '#cfcfcf' : 'black',
                    }}>
                    {item.闭环情况 === null ? '暂未填写' : item.闭环情况}
                  </div>
                </div>
              );
            })}
            <div className={styles['signature-container']}>
              <div className={styles['signature-title']}>
                <div>建管单位(部门)建议意见</div>
              </div>
              <div className={styles['signature-input']}>
                <div className={styles['opinion']}>
                  {/* <TextArea placeholder='主要建议意见：'></TextArea> */}
                  <div className={styles['title']}>主要建议意见：</div>
                  <div className={styles['content']}>
                    <div
                      className={styles['all-content']}
                      style={{ color: opinion === null ? '#cfcfcf' : 'black' }}>
                      {opinion === null ? '暂未填写' : opinion}
                    </div>
                  </div>
                </div>
                <div className={styles['opinion']}>
                  <div className={styles['title']}>问题处置：</div>
                  <div className={styles['content']}>
                    <div
                      className={styles['all-content']}
                      style={{
                        color: situation === null ? '#cfcfcf' : 'black',
                      }}>
                      {situation === null ? '暂未填写' : situation}
                    </div>
                  </div>
                  {/* <TextArea placeholder='问题处置：'></TextArea> */}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
