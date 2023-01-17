import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd-mobile';
import { UploadBtn } from '../../../../../../../../../common';
import httpUtil from '../../../../../../../../../utils/httpUtil';
import styles from './projectForm.module.css';

interface IProps {
  reasonId: number;
  index: number;
  handleCancel: Function;
  close: Function;
}

interface item {
  name: string;
}

export const ProjectForm: React.FC<IProps> = ({
  reasonId,
  index,
  handleCancel,
  close,
}: IProps) => {
  const [form] = Form.useForm();
  const reply = ['reason', 'opinion', 'condition', 'question'];
  const [url, setUrl] = useState<string>('');
  const [confirm, setConfirm] = useState<boolean>(true);
  let timer: NodeJS.Timer;
  const onFinish = (values: any) => {
    if (!confirm) {
      return message.warn('请等待上传成功');
    }
    const { text } = values;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(async () => {
      const hideLoading = message.loading('请求中', 0);
      try {
        const res = await httpUtil.replyQus({
          text,
          attachment: url,
          reason_id: String(reasonId),
          type: reply[index - 1],
        });
        console.log('test', res);
        if (res.code === 200) {
          handleCancel();
          close();
          form.resetFields();
          message.success('回复成功');
        }
      } finally {
        hideLoading();
      }
    }, 500);
  };

  useEffect(() => {
    setConfirm(true);
  }, []);

  const getUrl = (url: string) => {
    setUrl(url);
  };

  const getConfirm = () => {
    setConfirm(false);
  };

  const getTrue = () => {
    setConfirm(true);
  };

  return (
    <Form
      form={form}
      name='dynamic_form_nest_item'
      onFinish={onFinish}
      autoComplete='off'>
      <Form.Item
        name='text'
        label='回复'
        rules={[{ required: true, message: '回复内容不能为空' }]}>
        <Input placeholder='请输入回复内容'></Input>
      </Form.Item>
      <Form.Item>
        <UploadBtn getConfirm={getConfirm} getUrl={getUrl} getTrue={getTrue} />
      </Form.Item>
      <Form.Item>
        <Button
          type='primary'
          htmlType='submit'
          block
          className={styles['btn-background']}>
          确定
        </Button>
      </Form.Item>
    </Form>
  );
};
