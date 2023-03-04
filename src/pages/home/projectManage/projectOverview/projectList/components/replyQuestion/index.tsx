import { getStorageSync } from '@tarojs/taro';
import { useEffect, useState } from 'react';
import {
  AtIcon,
  AtModal,
  AtModalAction,
  AtModalContent,
  AtModalHeader,
} from 'taro-ui';
import { Button, Input, View } from '@tarojs/components';
import UploadFile from '@/common/components/uploadFile';
import { message } from '@/common/functions';
import httpUtil from '@/utils/httpUtil';
// import UploadBtn from '@/common/components/UploadBtn/UploadBtn';
import { ReplyQuestionProps, FileProps } from './indexProps';
import styles from './index.module.less';
import { ModalAttachmentComponent } from '../../../components/modalAttachmentComponent';

const ReplyQuestion: React.FC<ReplyQuestionProps> = selfProps => {
  const { isReplyModal, okReplyModal, selectRecord, selectIndex } = selfProps;
  const [replyText, setReplyText] = useState<string>('');
  const projectId = getStorageSync('projectId');
  const reply = ['reason', 'opinion', 'condition', 'question'];
  // 设置每次下载的文件
  const [fileUrl, setFileUrl] = useState('');
  // 控制打开上传文件与关闭
  const [isOpenLoadFile, setIsOpenLoadFile] = useState(false);
  const [hasUpload, setHasUpload] = useState(false);
  // 下载文件modal展示与否
  const [isDolShow, setIsDolShow] = useState(false);
  // 下载文件节点的 progressId
  const [downProgressId, setDownProgressId] = useState('');
  const [value, setValue] = useState<any>('');
  const [confirm, setConfirm] = useState<boolean>(true);

  let timer: NodeJS.Timer;
  const onFinish = () => {
    if (!confirm) {
      return message('请等待上传成功', 'warning');
    }
    if (timer) {
      clearTimeout(timer);
    }
    if (selectIndex !== 7) {
      timer = setTimeout(async () => {
        const hideLoading = message('请求中', 'warning');
        try {
          const data = {
            text: replyText,
            attachment: fileUrl,
            reason_id: String(selectRecord.key),
            type: reply[selectIndex - 1],
          };
          const res = await httpUtil.replyQus(data);
          if (res.code === 200) {
            okReplyModal();
            message('回复成功', 'success');
          }
        } finally {
          hideLoading();
        }
      }, 500);
    } else {
      timer = setTimeout(async () => {
        const hideLoading = message('请求中', 'warning');
        try {
          const data = {
            text: replyText,
            attachment: fileUrl,
            questionId: selectRecord.id,
            progressId: getStorageSync('progressId'),
          };
          const res = await httpUtil.specialReply(data);
          if (res.code === 200) {
            message('回复成功', 'success');
            okReplyModal();
          }
        } finally {
          hideLoading();
        }
      }, 500);
    }
  };
  useEffect(() => {
    setConfirm(true);
  }, []);
  return (
    <AtModal isOpened={isReplyModal} onClose={okReplyModal}>
      <AtModalHeader>回复清单</AtModalHeader>
      <AtModalContent>
        {selectIndex === 7 ? (
          <></>
        ) : (
          <View className={styles['reply-title']}>
            {selectRecord?.reason + ':'}
          </View>
        )}
        <View>
          <View className={styles['reply-title']}>回复:</View>
          <View className={styles['reply-input']}>
            {isReplyModal ? (
              <Input
                style={{ zIndex: 101 }}
                focus
                placeholder='请输入回复内容'
                onInput={e => setReplyText(e.detail.value)}
                value={replyText}></Input>
            ) : null}
          </View>
          <View className={styles['reply-title']}>
            附件:
            {!hasUpload ? (
              <View onClick={() => setIsOpenLoadFile(true)}>
                <AtIcon value='upload' size='20' color='orange'></AtIcon>未上传
              </View>
            ) : (
              <View>
                <AtIcon value='upload' size='20' color='#52c41a'></AtIcon>已上传
              </View>
            )}
          </View>
          <View>
            {' '}
            <UploadFile
              isUploadVisible={isOpenLoadFile}
              setIsUploadVisible={setIsOpenLoadFile}
              getData={() => {
                setHasUpload(true);
              }}
              getUrl={setFileUrl}
              progressId={Number(getStorageSync('progressId'))}
              projectId={Number(projectId)}
            />
            {/* <ModalAttachmentComponent
              isShow={isDolShow}
              setIsShow={setIsDolShow}
              url={fileUrl}
            /> */}
            {/* <UploadBtn chooseImg={chooseFile} onFilesValue={getOnFilesValue} /> */}
          </View>
        </View>
        <View className={styles['reply-title']}></View>
      </AtModalContent>
      <AtModalAction>
        {' '}
        <Button onClick={okReplyModal}>取消</Button>
        <Button onClick={onFinish}>确定</Button>{' '}
      </AtModalAction>
    </AtModal>
  );
};

export default ReplyQuestion;
