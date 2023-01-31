/* eslint-disable react/jsx-key */
import Taro, { getStorageSync } from '@tarojs/taro';
import { useState } from 'react';
import { View } from '@tarojs/components';
// import moment from 'moment';
import { AtIcon, AtButton, AtMessage } from 'taro-ui';
import { Item, AccordionForSpecialProps } from './indexProps';
import { canCheckOtherReply, message } from '../../functions/index';
import httpUtil from '../../../utils/httpUtil';

import styles from './index.module.less';
import { UploadBtn } from '../UploadBtn/UploadBtn';
import { useSelector } from '../../../redux/hooks';

const AccordionForSpecialist: React.FC<
  AccordionForSpecialProps
> = selfProps => {
  const {
    data,
    type,
    getSpecial,
    setIsCheckModal,
    setIsManageModal,
    setSelectRecord,
    setIsAdjustModal,
    setIsRejetModal,
    setIsPassModal,
    setSelectIndex,
    setIsReplyModal,
    setIsApplyUpper,
  } = selfProps;
  const ModalName = Taro.getStorageSync('ModalName');
  const [active, setActive] = useState<Boolean>(false);
  const [date, setDate] = useState<string>('');
  const [inDex, setInDex] = useState<number>();
  const [attachments, setAttachments] = useState<string>('');
  const projectId = Taro.getStorageSync('projectId')!;
  const progressId = Taro.getStorageSync('progressId')!;
  const searchUnits = useSelector(state => state.units.data.searchUnits);
  const [loading, setLoading] = useState(true);
  // 当前操作的question
  const [question_id, setQuestion_id] = useState<string>();

  // 回复内容
  const [replyText, setReplyText] = useState<string>('空');
  const [replyFile, setReplyFile] = useState<string>('');
  // 申请调整时间
  const [timeApplyTime, setTimeApplyTime] = useState('');
  const [timeApplyReason, setTimeApplyReason] = useState('');
  // const Height = String(85 * (data.item.length + 1)) + `px`;
  // const itemName = ['reason', 'opinion', 'condition', 'question'];
  let len: number = 0;
  const { status } = data;
  if (
    ModalName === 'projectOverview' &&
    (status == 1 || status == 3 || status == 5)
  ) {
    len = 1;
  } else if (
    ModalName === 'projectAudit' &&
    (status == 0 || status == 2 || status == 4)
  ) {
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

  const handleChooseTime = (question_id: number) => {
    setInDex(question_id!);
    setIsModalVisible(true);
  };

  const codeMapOperator = (code: number, record: any) => {
    const uid = getStorageSync('id');
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
          setIsAdjustModal(true);
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
      // setSubmitModalVisible(true);
      setQuestion_id(approvalId);
    };
    const lookReply = (question_id: string) => {
      console.log(question_id);
      message('请稍等', 'warning');
      httpUtil
        .specialCheckReply({
          projectId: Taro.getStorageSync('projectId')!,
          zxpgId: Number(question_id),
        })
        .then(res => {
          let replyObj;
          if (type === 1) {
            replyObj = res.data.reply.a[0];
          } else if (type === 2) {
            replyObj = res.data.reply.b[0];
          } else if (type === 3) {
            replyObj = res.data.reply.c[0];
          } else if (type === 4) {
            replyObj = res.data.reply.d[0];
          } else if (type === 8) {
            replyObj = res.data.reply.e[0];
          }
          const { text, attachment } = replyObj;
          // 返回回复信息
          setSelectRecord(replyObj);
          setReplyText(text);
          setAttachments(attachment);
        });
    };
    const showCheckModal = (record: Item) => {
      lookReply(question_id);
      setSelectIndex(7);
      setIsCheckModal(true);
    };
    const showManageSelector = async (record: Item) => {
      // const { aid, bid, cid, eid, did } = record;
      // const idList = ["", aid, bid, cid, did, "", "", "", eid];
      // const approvalId = idList[Type];
      // setId(approvalId);
      setSelectRecord(record);
      setSelectIndex(7);
      setIsManageModal(true);
    };
    const showAdjustDeadline = async (record: Item) => {
      setSelectRecord(record);
      setSelectIndex(7);
      setIsAdjustModal(true);
    };
    const showReplyModal = async (record: Item) => {
      setSelectRecord(record);
      setSelectIndex(7);
      setIsReplyModal(true);
    };
    const showPassConfirm = async (record: Item) => {
      setSelectRecord(record);
      setSelectIndex(7);
      setIsPassModal(true);
    };
    const showRejetConfirm = async (record: Item) => {
      setSelectRecord(record);
      setSelectIndex(7);
      setIsRejetModal(true);
    };
    const showApplyUpper = async (record: Item) => {
      setSelectRecord(record);
      setSelectIndex(7);
      setIsApplyUpper(true);
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
      return ModalName === 'projectAudit' ? (
        <View
          className={styles['pass-btn']}
          onClick={() => showManageSelector(record)}>
          <View>指定</View>
          <View>负责人</View>
        </View>
      ) : (
        <View>无</View>
      );
    } else if (code === 1) {
      // 待回复
      return ModalName === 'projectOverview' ? (
        <>
          <View
            className={styles['pass-btn']}
            onClick={() => showReplyModal(record)}>
            回复
          </View>
          <View
            className={styles['pass-btn']}
            onClick={() => showAdjustDeadline(record)}>
            调整时间
          </View>
        </>
      ) : (
        <>
          <View>无</View>
        </>
      );
    } else if (code === 2) {
      // 问题已回复待审批
      return ModalName === 'projectAudit' ? (
        <View>
          <View
            className={styles['look-btn']}
            onClick={() => showCheckModal(record)}>
            查看
          </View>
          <View
            className={styles['pass-btn']}
            onClick={() => showPassConfirm(record)}>
            通过
          </View>
          <View
            className={styles['back-btn']}
            onClick={() => showRejetConfirm(record)}>
            驳回
          </View>
        </View>
      ) : canCheckOtherReply(uid) ? (
        <View
          className={styles['cofirm-btn']}
          onClick={() => showCheckModal(record)}>
          查看回复
        </View>
      ) : (
        <>
          <View>无</View>
        </>
      );
    } else if (code === 3) {
      // 问题已解决后也可以查看回复
      return (
        <View
          className={styles['cofirm-btn']}
          onClick={() => showCheckModal(record)}>
          查看回复
        </View>
      );
    } else if (code === 4) {
      // 申请项目经理调整时间中
      return ModalName === 'projectAudit' ? (
        <>
          <View
            className={styles['look-btn']}
            onClick={() => showCheckModal(record)}>
            查看
          </View>
          <View
            className={styles['pass-btn']}
            onClick={() => showPassConfirm(record)}>
            通过
          </View>
          <View
            className={styles['back-btn']}
            onClick={() => showRejetConfirm(record)}>
            驳回
          </View>
          <View
            className={styles['cofirm-btn']}
            onClick={() => showApplyUpper(record)}>
            上报
          </View>
        </>
      ) : (
        <>
          <View>无</View>
        </>
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

  // const ApplyModal = () => {
  //   // const [form] = Form.useForm();
  //   const handleCancel = () => {
  //     setIsModalVisible(false);
  //   };

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
        setIsReplyModal(false);
      } else {
        message('回复失败', 'error');
      }
    } finally {
    }
  };
  return (
    <>
      {active && active ? (
        <View className={styles['boardw']}>
          <View className={styles['board-list']}>
            <View
              style={{
                width: '30%',
                lineHeight: '50rpx',
                textAlign: 'center',
                fontSize: '32rpx',
              }}>
              {data.single}
            </View>
            <View
              style={{
                fontSize: '32rpx',
                lineHeight: '50rpx',
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
          {/* 子列表 */}
          <View className={styles['board-list']}>
            <View className={styles['boardw-subList']} style={{ width: '20%' }}>
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
            <View className={styles['boardw-subList']} style={{ width: '20%' }}>
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
                    style={{ width: '25%' }}>
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
                    style={{ width: '30%' }}>
                    {codeMapOperator(list.status as number, list)}
                  </View>
                </View>
              );
            })
          ) : (
            <View className={styles['boardw-list']}>
              <View
                style={{
                  textAlign: 'center',
                  lineHeight: '30rpx',
                  fontSize: '30rpx',
                  color: '#9A9A9A',
                }}>
                暂无数据
              </View>
            </View>
          )}
        </View>
      ) : (
        <View className={styles['board']}>
          <View className={styles['board-list']}>
            <View
              style={{
                fontSize: '32rpx',
                lineHeight: '50rpx',
                width: '30%',
                textAlign: 'center',
              }}>
              {data.single}
            </View>
            <View
              style={{
                fontSize: '32rpx',
                lineHeight: '50rpx',
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
