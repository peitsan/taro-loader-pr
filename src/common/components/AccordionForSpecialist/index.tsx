/* eslint-disable react/jsx-key */
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { View } from '@tarojs/components';
// import moment from 'moment';
import {
  AtIcon,
  AtButton,
  AtModal,
  AtTextarea,
  AtModalContent,
  AtModalAction,
  AtForm,
  AtInput,
  AtMessage,
} from 'taro-ui';
import { Item, AccordionForSpecialProps } from './indexProps';
import { canCheckOtherReply, message } from '../../functions/index';
import httpUtil from '../../../utils/httpUtil';

import styles from './index.module.less';
import { UploadBtn } from '../UploadBtn/UploadBtn';
import { useSelector } from '../../../redux/hooks';

const AccordionForSpecialist: React.FC<
  AccordionForSpecialProps
> = selfProps => {
  const { data, type, getSpecial } = selfProps;
  const [active, setActive] = useState<Boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAdjustTime, setIsAdjustTime] = useState<boolean>(false);
  const [date, setDate] = useState<string>('');
  const [inDex, setInDex] = useState<number>();
  const [isCheckModal, setIsCheckModal] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<string>('');
  const projectId = Taro.getStorageSync('projectId')!;
  const progressId = Taro.getStorageSync('progressId')!;
  const searchUnits = useSelector(state => state.units.data.searchUnits);
  const [loading, setLoading] = useState(true);
  // 当前操作的question
  const [question_id, setQuestion_id] = useState<string>();

  const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);
  const [isTimeApplyModalVisible, setTimeApplyModalVisible] = useState(false);
  const [isSubmitModalVisible, setSubmitModalVisible] = useState(false);

  // 回复内容
  const [replyText, setReplyText] = useState<string>('空');
  const [replyFile, setReplyFile] = useState<string>('');
  // 申请调整时间
  const [timeApplyTime, setTimeApplyTime] = useState('');
  const [timeApplyReason, setTimeApplyReason] = useState('');
  // const Height = String(85 * (data.item.length + 1)) + `px`;
  // const itemName = ['reason', 'opinion', 'condition', 'question'];

  console.log(data);
  let len: number = 0;
  const { status } = data;
  if (status !== 1 && status !== 3 && status !== 5) {
    len = 1;
  }
  const renderResponse = (text: any) => {
    return text ? (
      text.map(txtItem => {
        const { nickname, deptName } = txtItem;
        return <View>{deptName + '-' + nickname}</View>;
      })
    ) : (
      <View style={{ color: 'silver' }}>无</View>
    );
  };

  const statusRender = (status: number) => {
    enum statusEnum {
      '负责人待指定',
      '待回复(负责人已指定)',
      '问题待审批',
      '问题已解决',
      '申请项目经理调整时间中',
      '项目经理申请上报调整中',
    }
    enum colorEnum {
      'reply' = 1,
      'approval',
      'solve',
    }
    return status === undefined ? (
      <View className={styles['solve']}>通过</View>
    ) : (
      <View className={styles[colorEnum[status]]}>
        {statusEnum[Number(status)]}
      </View>
    );
  };

  const timeRender = (text: string) => {
    return (
      <View style={{ color: text ? 'black' : 'silver' }}>
        {text ? text : '暂无'}
      </View>
    );
  };

  const showModal = (record: any) => {
    const { adate, bdate, cdate, ddate, edate, id } = record;
    setInDex(id);
    switch (type) {
      case 1:
        setDate(adate);
        break;
      case 2:
        setDate(bdate);
        break;
      case 3:
        setDate(cdate);
        break;
      case 4:
        setDate(ddate);
        break;
      case 8:
        setDate(edate);
        break;
      default:
        break;
    }
    setIsModalVisible(true);
  };
  const showApplyModal = (record: any) => {
    const { adate, bdate, cdate, ddate, edate, id } = record;
    setInDex(id);
    switch (type) {
      case 1:
        setDate(adate);
        break;
      case 2:
        setDate(bdate);
        break;
      case 3:
        setDate(cdate);
        break;
      case 4:
        setDate(ddate);
        break;
      case 8:
        setDate(edate);
        break;
      default:
        break;
    }
    setIsAdjustTime(true);
  };

  const showCheckModal = (record: any) => {
    const { attachment, content } = record;
    setAttachments(attachment);
    setReplyText(content);
    setIsCheckModal(true);
  };

  const okCheckModal = () => {
    setIsCheckModal(false);
  };

  const handleSelectResponsible = (record: any) => {
    const { aid, bid, cid, eid, did } = record;
    const idList = ['', aid, bid, cid, did, '', '', '', eid];
    const approvalId = idList[type];
    setInDex(approvalId);
    // setIsSelectResponsibleModalVisible(true);
  };

  // const handleSelectResponsibleCancel = () => {
  //   setIsSelectResponsibleModalVisible(false);
  // };

  const handleChooseTime = (question_id: number) => {
    // console.log("xxx", question_id);
    setInDex(question_id!);
    setIsModalVisible(true);
  };
  const CheckModal: React.FC = () => {
    const [canDownload, setCanDownload] = useState(false);
    // 文件下载的URL和name
    const [downloadURL, setDownloadURL] = useState('');
    const [downloadName, setDownloadName] = useState('');

    const downloadFile = () => {
      setCanDownload(false);
      const hiding = message('下载中', 'warning');
      httpUtil.downloadFile({ replyFile: attachments }).then(res => {
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
        title='专项评估'
        isOpened={isCheckModal}
        onConfirm={okCheckModal}
        onCancel={okCheckModal}>
        <AtModalContent>
          <View className={styles['reply-wrapper']}>
            <View className={styles['reply-title']}>文字内容：</View>
            <AtTextarea
              className={styles['reply-text-area']}
              disabled
              height={5}
              value={replyText}
              onChange={e => setReplyText(e)}
            />
            <View className={styles['reply-title']}>附件：</View>
            <View className={styles['reply-files']}>
              {attachments !== '' ? (
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
          <AtButton>取消</AtButton> <AtButton>确定</AtButton>{' '}
        </AtModalAction>
      </AtModal>
    );
  };

  const codeMapOperator = (code: number, record: any) => {
    const { id: question_id, adate, cdate, ddate, edate } = record;
    let flag;
    if (type === 3) {
      flag = !cdate;
    } else if (type === 4) {
      flag = !ddate;
    } else if (type === 8) {
      flag = !edate;
    } else if (type === 1) {
      flag = !adate;
    } else if (type === 2) {
      flag = false;
    }

    const confirmPass = async (records: any) => {
      const { aid, bid, cid, eid, did } = records;
      const idList = ['', aid, bid, cid, did, '', '', '', eid];
      const approvalId = idList[type];
      try {
        const res = await httpUtil.specialPass({
          projectId: String(projectId),
          zxpgId: approvalId,
        });
        if (res.code === 200) {
          message('通过成功', 'success');
          getSpecial();
        }
      } finally {
      }
    };

    const confirmBack = async (records: any) => {
      const { aid, bid, cid, eid, did } = records;
      const idList = ['', aid, bid, cid, did, '', '', '', eid];
      const approvalId = idList[type];
      try {
        const res = await httpUtil.specialReject({
          projectId: String(projectId),
          zxpgId: approvalId,
        });
        if (res.code === 200) {
          message('驳回成功', 'success');
          getSpecial();
        }
      } finally {
      }
    };

    const managerLookTimeApply = async (records: any) => {
      const { aid, bid, cid, eid, did } = records;
      const idList = ['', aid, bid, cid, did, '', '', '', eid];
      const approvalId = idList[type];
      message('请求中', 'warning');
      try {
        const res = await httpUtil.specialCheckTime({
          projectId: projectId,
          zxpgId: approvalId,
        });
        if (res.code === 200) {
          setTimeApplyModalVisible(true);
          const { reason, time } = res.data.adjust;
          setTimeApplyTime(time);
          setTimeApplyReason(reason);
        }
      } finally {
      }
    };

    const cofirmManagerApproveTimeApply = async (records: any) => {
      const { aid, bid, cid, eid, did } = records;
      const idList = ['', aid, bid, cid, did, '', '', '', eid];
      const approvalId = idList[type];
      message('请求中', 'warning');
      try {
        const res = await httpUtil.specialAdjustPass({
          projectId: String(projectId),
          questionId: approvalId,
        });
        if (res.code === 200) {
          message('请求中', 'success');
          getSpecial();
        }
      } finally {
      }
    };

    const cofirmManagerRejectTimeApply = async (records: any) => {
      const { aid, bid, cid, eid, did } = records;
      const idList = ['', aid, bid, cid, did, '', '', '', eid];
      const approvalId = idList[type];
      message('请求中', 'warning');
      try {
        const res = await httpUtil.specialAdjustReject({
          projectId: String(projectId),
          questionId: approvalId,
        });
        if (res.code === 200) {
          message('驳回成功', 'success');
          getSpecial();
        }
      } finally {
      }
    };

    const managerSubmit = (records: any) => {
      const { aid, bid, cid, eid, did } = records;
      const idList = ['', aid, bid, cid, did, '', '', '', eid];
      const approvalId = idList[type];
      setSubmitModalVisible(true);
      setQuestion_id(approvalId);
    };

    if (flag) {
      return (
        <AtButton
          className={styles['btn']}
          onClick={handleChooseTime.bind(null, question_id)}
          type='primary'>
          选择时间
        </AtButton>
      );
    }

    if (code === 0) {
      // 负责人待指定
      return (
        <AtButton
          className={styles['btn']}
          type='primary'
          onClick={handleSelectResponsible.bind(null, record)}>
          指定负责人
        </AtButton>
      );
    } else if (code === 1) {
      // 待回复
      return '无';
    } else if (code === 2) {
      // 问题已回复待审批
      return (
        <View>
          <AtButton
            type='primary'
            className={styles['look-btn']}
            onClick={lookReply.bind(null, question_id)}>
            查看
          </AtButton>
          {/* <Popconfirm
            title='确认通过吗?'
            onConfirm={confirmPass.bind(null, record)}
            okText='确认'
            cancelText='取消'> */}
          <AtButton
            type='primary'
            onClick={confirmPass.bind(null, record)}
            className={styles['pass-btn']}>
            通过
          </AtButton>
          {/* </Popconfirm> */}
          {/* <Popconfirm
            title='确认驳回吗?'
            onConfirm={confirmBack.bind(null, record)}
            okText='确认'
            cancelText='取消'> */}
          <AtButton
            onClick={confirmBack.bind(null, record)}
            className={styles['back-btn']}
            type='primary'>
            驳回
          </AtButton>
          {/* </Popconfirm> */}
        </View>
      );
    } else if (code === 3) {
      // 问题已解决后也可以查看回复
      return (
        <AtButton
          type='primary'
          className={styles['look-btn']}
          onClick={lookReply.bind(null, question_id)}>
          查看
        </AtButton>
      );
    } else if (code === 4) {
      // 申请项目经理调整时间中
      return (
        <View>
          <AtButton
            type='primary'
            className={styles['look-btn']}
            onClick={managerLookTimeApply.bind(null, record)}>
            查看
          </AtButton>
          {/* <Popconfirm
            title='确认通过吗?'
            onConfirm={cofirmManagerApproveTimeApply.bind(null, record)}
            okText='确认'
            cancelText='取消'> */}
          <AtButton
            onClick={cofirmManagerApproveTimeApply.bind(null, record)}
            type='primary'
            className={styles['pass-btn']}>
            通过
          </AtButton>
          {/* </Popconfirm> */}
          {/* <Popconfirm
            title='确认驳回吗?'
            onConfirm={cofirmManagerRejectTimeApply.bind(null, record)}
            okText='确认'
            cancelText='取消'> */}
          <AtButton
            onClick={cofirmManagerRejectTimeApply.bind(null, record)}
            className={styles['back-btn']}
            type='primary'>
            驳回
          </AtButton>
          <AtButton
            type='primary'
            onClick={managerSubmit.bind(null, record)}
            className={styles['warn-btn']}>
            上报
          </AtButton>
        </View>
      );
    } else if (code === 5) {
      // 项目经理申请上报调整中
      return '无';
    }
  };
  const codeMapStatusCss = (code: number) => {
    if (code === 0) {
      // 负责人待指定
      return <View className={styles['will-pass-text']}>负责人待指定</View>;
    } else if (code === 1) {
      // 待回复
      return <View>问题待回复(负责人已指定)</View>;
    } else if (code === 2) {
      // 问题已回复待审批
      return <View className={styles['will-pass-text']}>问题待审批</View>;
    } else if (code === 3) {
      // 问题已解决（回复通过之后）
      return <View className={styles['pass-text']}>问题已解决</View>;
    } else if (code === 4) {
      // 申请项目经理调整时间中
      return (
        <View className={styles['will-pass-text']}>申请项目经理调整时间中</View>
      );
    } else if (code === 5) {
      // 项目经理申请上报调整中
      return <View>项目经理申请上报调整中</View>;
    }
  };

  const ApplyModal = () => {
    // const [form] = Form.useForm();
    const handleCancel = () => {
      setIsModalVisible(false);
    };

    const [url, setUrl] = useState<string>('');
    const [confirm, setConfirm] = useState<boolean>(true);

    const getUrl = (urls: string) => {
      setUrl(urls);
    };

    const getConfirm = () => {
      setConfirm(false);
    };

    const getTrue = () => {
      setConfirm(true);
    };
    const onFinish = async (values: any) => {
      if (!confirm) {
        return message('请等待上传成功', 'warning');
      }
      const { text } = values;
      const hideLoading = message('请求中', 'warning');
      console.log(inDex, text, url);
      try {
        const res = await httpUtil.specialReply({
          questionId: Number(inDex),
          text,
          attachment: url,
          progressId,
        });
        if (res.code === 200) {
          hideLoading();
          getSpecial();
          message('回复成功', 'success');
          setIsModalVisible(false);
        } else {
          message('回复失败', 'error');
        }
      } finally {
      }
    };
    return (
      <AtModal
        title='回复清单'
        isOpened={isModalVisible}
        onCancel={handleCancel}>
        <AtForm onSubmit={onFinish}>
          <AtInput
            focus
            name='text'
            title='回复'
            type='text'
            placeholder='请输入回复内容'
            value={replyText}
            onChange={e => setReplyText(e as string)}
          />
          <View>
            <UploadBtn
              getConfirm={getConfirm}
              getUrl={getUrl}
              getTrue={getTrue}
            />
          </View>
          <AtButton
            type='primary'
            className={styles['btn-background']}
            formType='submit'>
            确定
          </AtButton>
        </AtForm>
      </AtModal>
    );
  };
  // const statusList = ['被驳回', '待审批', '通过'];
  // const statusColor = ['reply', 'approval', 'solve'];
  return (
    <>
      <AtModal
        isOpened={isCheckModal}
        onConfirm={okCheckModal}
        onClose={okCheckModal}>
        <AtModalContent>
          <View className={styles['reply-wrapper']}>
            <View className={styles['reply-title']}>文字内容：</View>
            <AtTextarea
              className={styles['reply-text-area']}
              disabled
              height={5}
              value={replyText}
              onChange={e => setReplyText(e)}
            />
            <View className={styles['reply-title']}>附件：</View>
            <View className={styles['reply-files']}>
              {/* {attachmentUrl !== '' ? (
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
              )} */}
            </View>
          </View>
        </AtModalContent>
        <AtModalAction>
          {' '}
          <AtButton>取消</AtButton> <AtButton>确定</AtButton>{' '}
        </AtModalAction>
      </AtModal>
      {active && active ? (
        <View className={styles['boardw']}>
          <View className={styles['board-list']}>
            <View
              style={{
                width: '30%',
                textAlign: 'center',
                fontSize: '32rpx',
              }}>
              {data.single}
            </View>
            <View
              style={{
                fontSize: '32rpx',
                lineHeight: '70rpx',
                width: '35%',
                textAlign: 'center',
                color: '#52c41a',
              }}>
              {len}
            </View>
            <View style={{ width: '35%' }} onClick={() => setActive(false)}>
              <View style={{ float: 'right' }}>
                <AtIcon value='chevron-up' size='20' color='#767676'></AtIcon>
              </View>
            </View>
          </View>
          <CheckModal />
          {/* 子列表 */}
          <View className={styles['board-list']}>
            <View className={styles['boardw-subList']} style={{ width: '30%' }}>
              提资
            </View>
            <View className={styles['boardw-subList']} style={{ width: '20%' }}>
              责任人及责任单位
            </View>
            <View className={styles['boardw-subList']} style={{ width: '25%' }}>
              时间
            </View>
            <View className={styles['boardw-subList']} style={{ width: '10%' }}>
              状态
            </View>
            <View className={styles['boardw-subList']} style={{ width: '10%' }}>
              操作
            </View>
          </View>
          {data.content.length !== 0 ? (
            data.content.map((list, ids) => {
              return (
                <View
                  className={styles['boardw-list']}
                  key={'reason-row' + ids}>
                  <View
                    className={styles['boardw-subList']}
                    style={{ width: '35%' }}>
                    {list.atizi}
                  </View>
                  <View
                    className={styles['boardw-subList']}
                    style={{ width: '20%' }}>
                    {renderResponse(list.responsibles)}
                  </View>
                  <View
                    className={styles['boardw-subList']}
                    style={{ width: '20%' }}>
                    {list.adate}
                  </View>
                  <View
                    className={styles['boardw-subList']}
                    style={{ width: '10%' }}>
                    {codeMapStatusCss(list.status as number)}
                  </View>
                  <View
                    className={styles['boardw-subList']}
                    style={{ width: '20%' }}>
                    {codeMapOperator(list.status as number, list)}
                  </View>
                </View>
              );
            })
          ) : (
            <View className={styles['boardw-list']}>暂无数据</View>
          )}
        </View>
      ) : (
        <View className={styles['board']}>
          <View className={styles['board-list']}>
            <View
              style={{
                fontSize: '32rpx',
                lineHeight: '70rpx',
                width: '30%',
                textAlign: 'center',
              }}>
              {data.single}
            </View>
            <View
              style={{
                fontSize: '32rpx',
                width: '35%',
                textAlign: 'center',
                color: '#52c41a',
              }}>
              {len}
            </View>
            <View
              style={{
                fontSize: '32rpx',
                lineHeight: '70rpx',
                width: '35%',
              }}>
              <View style={{ float: 'right' }} onClick={() => setActive(true)}>
                <AtIcon value='chevron-down' size='20' color='#767676'></AtIcon>
              </View>
            </View>
          </View>
          <AtMessage />
        </View>
      )}
    </>
  );
};
export default AccordionForSpecialist;
