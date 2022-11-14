import React, { useState } from "react";
import { Upload, message, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { baseURL } from "../../../utils/baseUrl";

interface IProps {
  getUrl?: Function;
  getConfirm?: Function;
  getTrue?: Function;
}

export const UploadBtn: React.FC<IProps> = ({
  getUrl,
  getConfirm,
  getTrue,
}: IProps) => {
  const token = sessionStorage.getItem("token");
  const props: UploadProps = {
    name: "file",
    action: `${baseURL}/worker/upload`,
    headers: {
      Authorization: "Bearer " + token,
    },
    beforeUpload() {
      getConfirm!();
    },
    onChange(info: any) {
      if (info.file.status !== "uploading") {
      }
      if (info.file.status === "done") {
        getUrl!(info.file.response.data.file.url);
        message.success(`上传成功`);
        getTrue!();
      } else if (info.file.status === "error") {
        message.error(`上传文件失败`);
        getTrue!();
      }
    },
  };

  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>点击上传附件</Button>
    </Upload>
  );
};
