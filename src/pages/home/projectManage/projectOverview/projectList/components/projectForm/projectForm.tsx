import React, { useState } from 'react';
import { Form, Input, Button, Space, message  } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import httpUtil from '../../../../../../../utils/httpUtil';
import styles from './projectForm.module.css'

interface IProps {
  indexKey:number
  handleOk:Function
}

interface item {
  name:string;
}

export const ProjectForm: React.FC<IProps> = ({indexKey, handleOk}: IProps) => {
  const [form] = Form.useForm();
  const addList = ['problem', 'protocol', 'procedure']
  const titleList = ['问题','协议','手续']
  const newList = ['原因','意见','条件']
  const [flush, setFlush] = useState<boolean>(false)
  let timer:NodeJS.Timer
  const onFinish = (values:any)=>{
    const {name, items} = values
    const data:item[] = []
    if(items){
      for(let i = 0; i < items.length; i ++){
        data.push({
          name:items[i].name
        })
      }
    }
    if(timer){
      clearTimeout(timer)
    }
    timer = setTimeout(async ()=>{
      if(data.length === 0){
        return message.warn(`请至少增加一条${newList[indexKey - 2]}`)
      }
      message.loading('请求中')
      try{
        const res =  await httpUtil.addNewList({
          progress_id:String(localStorage.getItem('progressId')),
          type:addList[indexKey - 2],
          items:data,
          name
        })
        
        if(res.code === 200){
          form.resetFields();
          setFlush(!flush)
          handleOk(!flush)
          message.destroy()
          message.success("添加成功")
        }
      }finally{
  
      }
    },500)
  }

  return (
    <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
      <Form.Item name="name" label={titleList[indexKey - 2]} rules={[{ required: true, message: `${titleList[indexKey - 2]}不能为空` }]}>
        <Input></Input>
      </Form.Item>
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field,index) => (
              <Space key={field.key} align="baseline">
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, curValues) =>
                    prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                  }
                >
                  {() => (
                    <Form.Item
                      {...field}
                      label={`${newList[indexKey - 2]}${index + 1}`}
                      name={[field.name, `name`]}
                      rules={[{ required: true, message: '原因不能为空' }]}
                    >
                      <Input></Input>
                    </Form.Item>
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
                <MinusCircleOutlined onClick={() => remove(field.name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed"  onClick={() => add()} block icon={<PlusOutlined />}>
                增加{newList[indexKey - 2]}
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit" block className={styles['btn-background']}>
          确定
        </Button>
      </Form.Item>
    </Form>
  );
};