import Taro from '@tarojs/taro';
import React, { useState } from 'react';
import { AtIcon, AtForm, AtInput, AtButton } from 'taro-ui';
import { message } from '../../../../../../../common/functions';
import httpUtil from '../../../../../../../utils/httpUtil';
import styles from './projectForm.module.css';

interface IProps {
  indexKey: number;
  handleOk: Function;
}

interface item {
  name: string;
}

export const ProjectForm: React.FC<IProps> = ({
  indexKey,
  handleOk,
}: IProps) => {
  // const [form] = Form.useForm();
  const addList = ['problem', 'protocol', 'procedure'];
  const titleList = ['问题', '协议', '手续'];
  const newList = ['原因', '意见', '条件'];
  const [flush, setFlush] = useState<boolean>(false);
  let timer: NodeJS.Timer;
  const onFinish = (values: any) => {
    const { name, items } = values;
    const data: item[] = [];
    if (items) {
      for (let i = 0; i < items.length; i++) {
        data.push({
          name: items[i].name,
        });
      }
    }
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(async () => {
      if (data.length === 0) {
        return message(`请至少增加一条${newList[indexKey - 2]}`, 'warning');
      }
      message('请求中', 'warning');
      try {
        const res = await httpUtil.addNewList({
          progress_id: String(Taro.getStorageSync('progressId')),
          type: addList[indexKey - 2],
          items: data,
          name,
        });

        if (res.code === 200) {
          form.resetFields();
          setFlush(!flush);
          handleOk(!flush);
          message('添加成功', 'success');
        }
      } finally {
      }
    }, 500);
  };

  return (
    <AtForm onSubmit={onFinish}>
      {/* <AtInput
        required
        title={titleList[indexKey - 2]}
        type='text'
        placeholder='请输入账号'
        value={name}
        onChange={e => (e as string)}
      />
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <View key={field.key} align='baseline'>
                <View
                  noStyle
                  shouldUpdate={(prevValues, curValues) =>
                    prevValues.area !== curValues.area ||
                    prevValues.sights !== curValues.sights
                  }>
                  {() => (
                    <View
                      {...field}
                      label={`${newList[indexKey - 2]}${index + 1}`}
                      name={[field.name, `name`]}
                      rules={[{ required: true, message: '原因不能为空' }]}>
                         <AtInput
                              required
                              title='账号'
                              name='username'
                              type='text'
                              placeholder='请输入账号'
                              value={username}
                              onChange={e => setUsername(e as string)}
                                   />
                    </View>
                  )}
                </Form.Item>
                {/* <Form.Item
                  {...field}
                  label={`附件${index + 1}`}
                  name={[field.name, `附件${index + 1}`]}
                  rules={[{ required: false}]}
                >
                  <UploadBtn />
                </Form.Item> */}
                <AtIcon
                  value='subtract'
                  size='30'
                  color='#F00'
                  onClick={() => remove(field.name)}
                />
              </Space>
            ))}
            <Form.Item>
              <Button
                type='dashed'
                onClick={() => add()}
                block
                icon={<AtIcon value='add' size='30' color='#F00' />}>
                增加{newList[indexKey - 2]}
              </Button>
            </Form.Item>
          </>
        )}
      <AtButton
        type='primary'
        formType='submit'
        className={styles['btn-background']}>
        确定
      </AtButton> */}
    </AtForm>
  );
};
