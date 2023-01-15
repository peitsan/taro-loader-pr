import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Space,
  Table,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";
import { FileTextOutlined } from '@ant-design/icons'
import React, { useState } from "react";
import { canCheckOtherReply, UploadBtn } from "../../../../../../../../common";
import httpUtil from "../../../../../../../../utils/httpUtil";
import styles from "./childrenTable.module.css";
import { IProps } from "./childrenTableType";

export const ChildrenTable: React.FC<IProps> = ({
  item,
  type,
  getSpecial,
}: IProps) => {

  const progressId = localStorage.getItem("progressId")!;

  const renderResponse = (text: any) => {
    return text ? (
      text.map((item: any) => {
        const { nickname, deptName } = item;
        return <div>{deptName + '-' + nickname}</div>;
      })
    ) : (
      <span style={{ color: "silver" }}>无</span>
    );
  };

  const statusRender = (status: number) => {
    
    enum statusEnum {
      '负责人待指定',
      '待回复(负责人已指定)',
      '问题待审批' ,
      '问题已解决',
      '申请项目经理调整时间中',
      '项目经理申请上报调整中'
    }
    enum colorEnum {
      "reply" = 1,
      "approval",
      "solve"
    }
    return status === undefined ? (
      <span className={styles["solve"]}>{"通过"}</span>
    ) : (
      <span className={styles[colorEnum[status]]}>
        {statusEnum[Number(status)]}
      </span>
    );
  }

  const timeRender = (text:string) => {
    return (
      <div style={{color:text ? 'black' : 'silver'}}>{ text ? text : '暂无' }</div>
    )
  }

  const columns = [
    [],
    [
      {
        title: `提资`,
        dataIndex: "atizi",
        key: "atizi",
        width: "15%",
        render: (text: any) => {
          console.log('xxx', text)
          return <span>{text ? text : "暂无"}</span>;
        },
      },
      {
        title: `责任人及责任单位`,
        dataIndex: "responsibles",
        key: "responsibles",
        width: "15%",
        render: renderResponse
      },
      {
        title: "时间",
        dataIndex: "adate",
        key: "adate",
        width: "15%",
        render: timeRender
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: '15%',
        render: statusRender
      },
      {
        title: "操作",
        key: "action",
        render: (_: any, record: any) => {
          const { responsibles, status } = record;
          let responsibleId = []
          if (responsibles) {
            responsibleId = responsibles.map((item:any) => {
              return item.id
            })
          }
          const { id } = JSON.parse(sessionStorage.getItem("user")!);
          return status === 1 && responsibleId?.includes(id) ? (
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
          ) : ((status === 2 || status === 3) && responsibleId?.includes(id)) ||
            (status === 3 &&
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
    ],
    [
      {
        title: "成果",
        dataIndex: "bchengguo",
        key: "bchengguo",
        width: "15%",
        render: (text: any) => {
          return <span>{text ? text : "暂无"}</span>;
        },
      },
      {
        title: "要求",
        dataIndex: "byaoqiu",
        key: "byaoqiu",
        width: "15%",
        render: (text: any) => {
          return <span>{text ? text : "暂无"}</span>;
        },
      },
      {
        title: "时间",
        dataIndex: "bdate",
        key: "bdate",
        width: "15%",
        render: timeRender
      },
      {
        title: `责任人及责任单位`,
        dataIndex: "responsibles",
        key: "responsibles",
        width: "15%",
        render: renderResponse
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: '15%',
        render: statusRender
      },
      {
        title: "操作",
        key: "action",
        render: (_: any, record: any) => {
          const { responsibles, status } = record;
          let responsibleId = []
          if (responsibles) {
            responsibleId = responsibles.map((item:any) => {
              return item.id
            })
          }
          const { id } = JSON.parse(sessionStorage.getItem("user")!);
          return status === 1 && responsibleId.includes(id) ? (
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
          ) : ((status === 2 || status === 3) && responsibleId.includes(id)) ||
            (status === 3 &&
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
    ],
    [
      {
        title: `提资`,
        dataIndex: "ctizi",
        key: "ctizi",
        width: "15%",
        render: (text: any) => {
          return <span>{text ? text : "暂无"}</span>;
        },
      },
      {
        title: "时间",
        dataIndex: "cdate",
        key: "cdate",
        width: "15%",
        render: timeRender
      },
      {
        title: `责任人及责任单位`,
        dataIndex: "responsibles",
        key: "responsibles",
        width: "15%",
        render: renderResponse,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: '15%',
        render: statusRender
      },
      {
        title: "操作",
        key: "action",
        render: (_: any, record: any) => {
          const { responsibles, status } = record;
          let responsibleId = []
          if (responsibles) {
            responsibleId = responsibles.map((item:any) => {
              return item.id
            })
          }
          const { id } = JSON.parse(sessionStorage.getItem("user")!);
          return status === 1 && responsibleId.includes(id) ? (
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
          ) : ((status === 2 || status === 3) && responsibleId.includes(id)) ||
            (status === 3 &&
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
    ],
    [
      {
        title: "成果",
        dataIndex: "dchengguo",
        key: "dchengguo",
        width: "15%",
        render: (text: any) => {
          return <span>{text ? text : "暂无"}</span>;
        },
      },
      {
        title: "要求",
        dataIndex: "dyaoqiu",
        key: "dyaoqiu",
        width: "15%",
        render: (text: any) => {
          return <span>{text ? text : "暂无"}</span>;
        },
      },
      {
        title: "时间",
        dataIndex: "ddate",
        key: "ddate",
        width: "15%",
        render: timeRender
      },
      {
        title: `责任人及责任单位`,
        dataIndex: "responsibles",
        key: "responsibles",
        width: "15%",
        render: renderResponse
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: '15%',
        render: statusRender
      },
      {
        title: "操作",
        key: "action",
        render: (_: any, record: any) => {
          const { responsibles, status } = record;
          let responsibleId = []
          if (responsibles) {
            responsibleId = responsibles.map((item:any) => {
              return item.id
            })
          }
          const { id } = JSON.parse(sessionStorage.getItem("user")!);
          return status === 1 && responsibleId.includes(id) ? (
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
          ) : ((status === 2 || status === 3) && responsibleId.includes(id)) ||
            (status === 3 &&
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
    ],
    [],
    [],
    [],
    [
      {
        title: "成果",
        dataIndex: "echengguo",
        key: "echengguo",
        width: "15%",
        render: (text: any) => {
          return <span>{text ? text : "暂无"}</span>;
        },
      },
      {
        title: "时间",
        dataIndex: "edate",
        key: "edate",
        width: "15%",
        render: timeRender
      },
      {
        title: `责任人及责任单位`,
        dataIndex: "responsibles",
        key: "responsibles",
        width: "15%",
        render: renderResponse
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: '15%',
        render: statusRender
      },
      {
        title: "操作",
        key: "action",
        render: (_: any, record: any) => {
          const { responsibles, status } = record;
          let responsibleId = []
          if (responsibles) {
            responsibleId = responsibles.map((item:any) => {
              return item.id
            })
          }
          const { id } = JSON.parse(sessionStorage.getItem("user")!);
          return status === 1 && responsibleId.includes(id) ? (
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
          ) : ((status === 2 || status === 3) && responsibleId.includes(id)) ||
            (status === 3 &&
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
    ],
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAdjustTime, setIsAdjustTime] = useState<boolean>(false);
  const [date, setDate] = useState<string>("");
  const [id, setId] = useState<number>();
  const [isCheckModal, setIsCheckModal] = useState<boolean>(false)
  const [attachment, setAttachment] = useState<string>('')
  const [replyText, setReplyText] = useState<string>('')

  const showModal = (record: any) => {
    const { id } = record;
    setId(id);
    const { adate, bdate, cdate, ddate, edate } = record;
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
    const { id } = record;
    setId(id);
    const { adate, bdate, cdate, ddate, edate } = record;
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
    const { attachment, content } = record
    setAttachment(attachment)
    setReplyText(content)
    setIsCheckModal(true)
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
      httpUtil.downloadFile({ replyFile: attachment }).then((res) => {
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
        title="专项评估"
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
            {attachment !== "" ? (
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

  const ApplyModal = () => {
    const [form] = Form.useForm();
    const handleCancel = () => {
      setIsModalVisible(false);
    };

    const [url, setUrl] = useState<string>("");
    const [confirm, setConfirm] = useState<boolean>(true);

    const getUrl = (url: string) => {
      setUrl(url);
    };

    const getConfirm = () => {
      setConfirm(false);
    };

    const getTrue = () => {
      setConfirm(true);
    };
    const onFinish = async (values: any) => {
      if (!confirm) {
        return message.warn("请等待上传成功");
      }
      const { text } = values;
      const hideLoading = message.loading("请求中", 0);
      console.log(id, text, url);
      try {
        const res = await httpUtil.specialReply({
          questionId: Number(id),
          text,
          attachment: url,
          progressId
        });
        if (res.code === 200) {
          hideLoading();
          getSpecial();
          message.success("回复成功");
          setIsModalVisible(false);
        } else {
          message.error('回复失败')
          message.destroy();
        }
      } finally {
        message.destroy();
      }
    };

    return (
      <Modal
        title={`回复清单`}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="text"
            label="回复"
            rules={[{ required: true, message: "回复内容不能为空" }]}
          >
            <Input placeholder="请输入回复内容"></Input>
          </Form.Item>
          <Form.Item>
            <UploadBtn
              getConfirm={getConfirm}
              getUrl={getUrl}
              getTrue={getTrue}
            />
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
      </Modal>
    );
  };

  const AdjustForm = () => {
    const [form] = Form.useForm();
    const handleAdjustTimeCancel = () => {
      setIsAdjustTime(false);
    };
    const onFinish = async (values: any) => {
      const { reason, time } = values;
      const date = new Date(time?.format("YYYY-MM-DD")!).getTime();
      const hide = message.loading("请求中", 0);
      try {
        const res = await httpUtil.specialAdjustTime({
          questionId: Number(id),
          adjustTime: date,
          adjustReason: reason,
          progressId: progressId
        });
        if (res.code === 200) {
          hide();
          getSpecial();
          message.success("操作成功");
          setIsAdjustTime(false);
        }
      } finally {
        message.destroy();
      }
    };

    const disabledDate = (currentDate: any) => {
      const startTime = moment(date);
      return currentDate.valueOf() < startTime.valueOf() + 24 * 60 * 60 * 1000;
    };

    return (
      <Modal
        title={`申请调整时间`}
        visible={isAdjustTime}
        onCancel={handleAdjustTimeCancel}
        footer={null}
      >
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
            <Input placeholder="请填写申请原因"></Input>
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
      </Modal>
    );
  };

  return (
    <>
      <ApplyModal />
      <AdjustForm />
      <CheckModal />
      <Table columns={columns[type]} dataSource={item} pagination={false} />
    </>
  );
};
