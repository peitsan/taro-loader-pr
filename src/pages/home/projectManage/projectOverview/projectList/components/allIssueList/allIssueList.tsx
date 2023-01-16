import React, { useEffect, useState } from "react";
import { Table } from "antd-mobile";
import type { ColumnsType } from "antd-mobile/lib/table";
import { ChildrenTable } from "./childrenTable/childrenTable";
import { IProps, DataType, ExpandedDataType } from "./allIssueType";
import {
  questions,
  opinions,
  reasons,
  conditions,
} from "../../projectListType/projectListType";
import styles from "./allIssueList.module.css";

export const AllIssueList: React.FC<IProps> = ({
  issuesItems,
  problemsItem,
  proceduresItem,
  protocolsItem,
  index,
  fresh,
}: IProps) => {
  const expandedRowRender = (record: DataType) => {
    const { item } = record;
    console.log("item", item);
    return <ChildrenTable item={item} index={index} fresh={fresh} />;
  };

  const listItem = [problemsItem, protocolsItem, proceduresItem, issuesItems];
  const titleList = ["问题概述", "协议清单", "手续清单", "问题概述"];
  const columns: ColumnsType<DataType> = [
    // { title: '序号', dataIndex: 'index', key: 'index', width:"25%" },
    {
      title: `${titleList[index - 1]}`,
      dataIndex: "issueOverView",
      key: "issueOverView",
      width: "20%",
    },
    index === 4
      ? {}
      : {
          title: "所属流程",
          key: "progress",
          width: "30%",
          render: (_: any, record: DataType) => {
            const { name } = record.progress;
            return <span>{name}</span>;
          },
          sorter: (a, b) => {
            if (b.len - a.len > 0) {
              return a.progress.type - b.progress.type;
            }
            return b.progress.type - a.progress.type;
          },
          defaultSortOrder: "ascend",
        },
    {
      title: "需解决问题数",
      key: "number",
      render: (_: any, record: DataType) => {
        const { item } = record;
        let len = 0;
        for (let i = 0; i < item.length; i++) {
          const { manageId, code } = item[i];
          const { id } = JSON.parse(Taro.getStorageSync("user")!);
          if (manageId.includes(id) && code === 1) {
            len++;
          }
        }
        const className = len > 0 ? "num1-color" : "num-color";
        return <span className={styles[className]}>{len}</span>;
      },
      sorter: (a, b) => b.len - a.len,
    },
    index == 4
      ? {}
      : {
          title: "问题状态",
          dataIndex: "status",
          key: "status",
          width: "30%",
          render: (text, record) => {
            const { status } = record;
            const statusList = ["被驳回", "待审批", "通过"];
            const statusColor = ["reply", "approval", "solve"];
            return status === undefined ? (
              <span className={styles["solve"]}>{"通过"}</span>
            ) : (
              <span className={styles[statusColor[status + 1]]}>
                {statusList[Number(status) + 1]}
              </span>
            );
          },
          sorter: (a, b) => a.len - b.len,
        },
  ];

  const itemListFunction = (
    itemList: questions[] | opinions[] | reasons[] | conditions[]
  ) => {
    const itemArr: ExpandedDataType[] = [];
    for (let i = 0; i < itemList.length; i++) {
      const { id, name, responsibles, status, planTime, code } = itemList[i];
      const idList = [];
      for (let i = 0; i < responsibles.length; i++) {
        idList.push(responsibles[i].id);
      }
      itemArr.push({
        key: id,
        reason: name,
        planTime: planTime ? planTime : "未指定时间",
        manage: responsibles,
        manageId: idList,
        current: status,
        code,
      });
    }
    return itemArr;
  };
  const data: DataType[] = [];
  const dataList: any = listItem[index - 1] ? listItem[index - 1] : [];
  for (let i = 0; i < dataList.length; ++i) {
    const { id, name, code, progress, len } = dataList[i];
    let itemList = [];
    switch (index) {
      case 1:
        itemList = dataList[i].reasons;
        break;
      case 2:
        itemList = dataList[i].opinions;
        break;
      case 3:
        itemList = dataList[i].conditions;
        break;
      case 4:
        itemList = dataList[i].questions;
        break;
    }
    data.push({
      key: id,
      index: i + 1,
      issueOverView: name,
      item: itemListFunction(itemList),
      status: code,
      progress,
      len,
    });
  }

  return (
    <Table
      className="components-table-demo-nested"
      columns={columns}
      expandable={{ expandedRowRender: (e) => expandedRowRender(e) }}
      dataSource={data}
      pagination={
        index === 4
          ? false
          : {
              total: data?.length,
              defaultPageSize: 7,
              pageSizeOptions: [7, 15, 30, 50],
              showSizeChanger: true,
            }
      }
    />
  );
};
