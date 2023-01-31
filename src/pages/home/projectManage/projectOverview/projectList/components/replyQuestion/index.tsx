import { getStorageSync } from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { AtModal, AtModalAction, AtModalContent, AtModalHeader } from 'taro-ui';
import { Button, Input, View } from '@tarojs/components';
import { message } from '@/common/functions';
import httpUtil from '@/utils/httpUtil';
import UploadBtn from '@/common/components/UploadBtn/UploadBtn';
import { ReplyQuestionProps, FileProps } from './indexProps';
import styles from './index.module.less';

const ReplyQuestion: React.FC<ReplyQuestionProps> = selfProps => {
  const { isReplyModal, okReplyModal, selectRecord, selectIndex } = selfProps;
  const [replyText, setReplyText] = useState<string>('');
  const reply = ['reason', 'opinion', 'condition', 'question'];
  const [files, setFiles] = useState<FileProps[]>([]);
  const [value, setValue] = useState<any>('');
  const [url, setUrl] = useState<string>('');
  const [confirm, setConfirm] = useState<boolean>(true);
  const chooseFile = useState({
    fileNum: 1,
    files: [],
    showUploadBtn: true,
    upLoadImg: [],
  });
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
            attachment: url,
            reason_id: String(selectRecord.key),
            type: reply[selectIndex - 1],
          };
          console.log('test', data);
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
            attachment: url,
            questionId: selectRecord.id,
            progressId: getStorageSync('progressId'),
          };
          console.log('test', data);
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
  // 拿到子组件上传图片的路径数组
  const getOnFilesValue = (value: FileProps[]) => {
    console.log(3, value);
    setFiles(value);
    if (value.length > 0) setUrl(value[0].url as string);
    console.log(files);
    const handleChange = val => {
      setValue(val);
    };
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
            <Input
              placeholder='请输入回复内容'
              onInput={e => setReplyText(e.detail.value)}
              value={replyText}></Input>
          </View>
          <View className={styles['reply-title']}>选择附件:</View>
          <View>
            {' '}
            <UploadBtn chooseImg={chooseFile} onFilesValue={getOnFilesValue} />
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
