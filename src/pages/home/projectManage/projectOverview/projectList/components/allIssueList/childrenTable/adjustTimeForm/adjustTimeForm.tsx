import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, DatePicker } from "antd";
import httpUtil from "../../../../../../../../../utils/httpUtil";
import styles from "./adjustTimeForm.module.css";
import moment from "moment";

interface IProps {
  reasonId: number;
  index: number;
  handleCancel: Function;
  TimeClose: Function;
  PlanTime: string;
}

interface item {
  name: string;
}

export const AdjustTimeForm: React.FC<IProps> = ({
  reasonId,
  index,
  handleCancel,
  TimeClose,
  PlanTime,
}: IProps) => {
  const [form] = Form.useForm();
  const reply = ["reason", "opinion", "condition", "question"];

  let timer: NodeJS.Timer;
  const onFinish = (values: any) => {
    console.log(values);
    const { reason, time } = values;
    const date = String(new Date(time?.format("YYYY-MM-DD")!).getTime());
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(async () => {
      message.loading("请求中");
      try {
        const res = await httpUtil.applyAdjust({
          adjustType: reply[index - 1],
          adjustReason: reason,
          adjustTime: Number(date),
          reasonId: String(reasonId),
        });
        console.log(res);
        if (res.code === 200) {
          handleCancel();
          TimeClose();
          form.resetFields();
          message.destroy();
          message.success("申请成功");
        }
      } finally {
      }
    }, 500);
  };

  const disabledDate = (currentDate: any) => {
    const startTime = moment(PlanTime);
    return currentDate.valueOf() < startTime.valueOf() + 24 * 60 * 60 * 1000;
  };

  return (
    <Form
      form={form}
      name="dynamic_form_nest_item"
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        name="reason"
        label="申请原因"
        rules={[{ required: true, message: "申请原因不能为空" }]}
      >
        <Input placeholder="填写申请原因"></Input>
      </Form.Item>
      <Form.Item
        name="time"
        label="调整时间"
        rules={[{ required: true, message: "调整时间不能为空" }]}
      >
        <DatePicker placeholder="选择时间" disabledDate={(e) => disabledDate(e)} />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          className={styles["btn-background"]}
        >
          确定
        </Button>
      </Form.Item>
    </Form>
  );
};
