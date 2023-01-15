import React, { useState } from "react";
import { Table, Space, Button, Modal, Tooltip, message } from "antd";
import type { ColumnsType } from "antd/lib/table";
import { DataType, IProps, Item } from "./childrenTableType";
import { ProjectForm } from "./projectForm/projectForm";
import { AdjustTimeForm } from "./adjustTimeForm/adjustTimeForm";
import { FileTextOutlined } from "@ant-design/icons";
import { canCheckOtherReply } from "../../../../../../../../common/function";
import httpUtil from "../../../../../../../../utils/httpUtil";
import TextArea from "antd/lib/input/TextArea";
import styles from "./childrenTable.module.css";

export const ChildrenTable: React.FC<IProps> = ({
  item,
  index,
  fresh,
}: IProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reasonId, setReasonId] = useState<number>(0);
  const [isAdjustTime, setIsAdjustTime] = useState<boolean>(false);
  const [planTime, setPlanTime] = useState<string>("");
  const [isCheckModal, setIsCheckModal] = useState<boolean>(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string>("");
  const [replyText, setReplyText] = useState<string>("");
  const showModal = (record: Item) => {
    setIsModalVisible(true);
    setReasonId(Number(record.key));
  };
  const showApplyModal = (record: Item) => {
    setIsAdjustTime(true);
    setPlanTime(record.planTime);
    setReasonId(Number(record.key));
  };
  const titleList = ["原因", "意见", "条件", "原因"];
  const itemName = ["reason", "opinion", "condition", "question"];
  const columns: ColumnsType<DataType> = [
    {
      title: `${titleList[index - 1]}`,
      dataIndex: "reason",
      key: "reason",
      width: "20%",
    },
    {
      title: "计划完成时间",
      dataIndex: "planTime",
      key: "planTime",
      width: "20%",
    },
    {
      title: "责任人及责任单位",
      dataIndex: "manage",
      key: "manage",
      width: "20%",
      render: (responsibleArray: any[]) => {
        return (
          responsibleArray && responsibleArray.length !== 0 ?
          <div>
            {responsibleArray.map((item) => {
              return <div>{item.unit.name + "-" + item.nickname}</div>;
            })}
          </div> : '暂未指定'
        );
      },
    },
    {
      title: "当前整改情况",
      dataIndex: "current",
      key: "current",
      width: "20%",
      render: (text: string, record: DataType) => {
        const { code } = record;
        const classList = ["", "approval", "", "solve"];
        const className = classList[code];
        return <span className={styles[className]}>{text}</span>;
      },
    },
    {
      title: "操作",
      key: "operation",
      render: (_, record) => {
        const { manageId, code } = record;
        const { id } = JSON.parse(sessionStorage.getItem("user")!);
        return code === 1 && manageId.includes(id) ? (
          <>
            <Space size="middle">
              <Button
                size="small"
                type="primary"
                className={styles["btn-background"]}
                onClick={() => showModal(record)}
              >
                回复
              </Button>
            </Space>
            <Space size="middle">
              <Button
                size="small"
                type="primary"
                className={styles["btn-background"]}
                onClick={() => showApplyModal(record)}
              >
                申请调整时间
              </Button>
            </Space>
          </>
        ) : ((code === 2 || code === 3) && manageId.includes(id)) ||
          (code === 3 &&
            canCheckOtherReply(Number(localStorage.getItem("fatherId")))) ? (
          <Space size="middle">
            <Button
              size="small"
              type="primary"
              className={styles["btn-background"]}
              onClick={() => showCheckModal(record)}
            >
              查看回复
            </Button>
          </Space>
        ) : (
          <span>无</span>
        );
      },
    },
  ];

  const lookReply = (question_id: string) => {
    message.loading("请稍等", 0);
    httpUtil
      .lookAllListReply({
        project_id: localStorage.getItem("projectId")!,
        question_id: question_id,
        itemName: itemName[index - 1],
      })
      .then((res) => {
        const {
          data: {
            reply: { text, attachment },
          },
        } = res;
        setReplyText(text);
        setAttachmentUrl(attachment);
        message.destroy();
        setIsCheckModal(true);
      });
  };

  const showCheckModal = (record: Item) => {
    lookReply(String(record.key));
  };

  const okCheckModal = () => {
    setIsCheckModal(false);
  };

  const CheckModal = () => {
    const [canDownload, setCanDownload] = useState(false);
    // 文件下载的URL和name
    const [downloadURL, setDownloadURL] = useState("");
    const [downloadName, setDownloadName] = useState("");

    const downloadFile = () => {
      setCanDownload(false);
      const hiding = message.loading("下载中", 0);
      httpUtil.downloadFile({ replyFile: attachmentUrl }).then((res) => {
        const blob = new Blob([res.blob], {
          type: "application/octet-stream",
        });
        const downloadURL = window.URL.createObjectURL(blob);
        const downloadName = res.fileName;
        setDownloadURL(downloadURL);
        setDownloadName(downloadName);
        setCanDownload(true);
        hiding();
      });
    };

    return (
      <Modal
        title="初设批复附件"
        visible={isCheckModal}
        onOk={okCheckModal}
        onCancel={okCheckModal}
        okText="确认"
        cancelText="关闭"
      >
        <div className={styles["reply-wrapper"]}>
          <span className={styles["reply-title"]}>文字内容：</span>
          <TextArea
            className={styles["reply-text-area"]}
            readOnly={true}
            autoSize={{ minRows: 3, maxRows: 5 }}
            value={replyText}
          />
          <span className={styles["reply-title"]}>附件：</span>
          <div className={styles["reply-files"]}>
            {attachmentUrl !== "" ? (
              canDownload ? (
                <a href={downloadURL} download={downloadName}>
                  <FileTextOutlined />
                  下载成功，点击查看
                </a>
              ) : (
                <a onClick={downloadFile}>
                  <FileTextOutlined />
                  下载附件
                </a>
              )
            ) : (
              <a style={{ color: "silver" }}>
                <FileTextOutlined />
                无附件
              </a>
            )}
          </div>
        </div>
      </Modal>
    );
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAdjustTimeCancel = () => {
    setIsAdjustTime(false);
  };
  const close = () => {
    setIsModalVisible(false);
  };
  const TimeClose = () => {
    setIsAdjustTime(false);
  };

  const data: DataType[] = [...item];
  return (
    <div>
      <Modal
        title={`回复清单`}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <ProjectForm
          reasonId={reasonId}
          index={index}
          handleCancel={fresh}
          close={close}
        />
      </Modal>
      <Modal
        title={`申请调整时间`}
        visible={isAdjustTime}
        onCancel={handleAdjustTimeCancel}
        footer={null}
      >
        <AdjustTimeForm
          reasonId={reasonId}
          PlanTime={planTime}
          index={index}
          TimeClose={TimeClose}
          handleCancel={fresh}
        />
      </Modal>
      <Table columns={columns} dataSource={data} pagination={false} />
      <CheckModal />
    </div>
  );
};
