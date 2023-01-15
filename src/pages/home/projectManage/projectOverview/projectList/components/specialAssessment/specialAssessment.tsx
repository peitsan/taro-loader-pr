import React, { useEffect, useState } from "react";
import { ChildrenTable } from "./childrenTable/childrenTable";
import httpUtil from "../../../../../../../utils/httpUtil";
import { IProps, dataItem } from "./specialAssessmentType";
import styles from "./specialAssessment.module.css";
import { Table } from "antd";

export const SpecialAssessment: React.FC<IProps> = ({ Type }: IProps) => {
  const progressId = localStorage.getItem("progressId")!;
  const [specialList, setSpecialList] = useState<dataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const columns = [
    {
      title: `标题`,
      dataIndex: "single",
      key: "single",
    },
    {
      title: "需解决问题数",
      key: "number",
      render: (_: any, record: any) => {
        console.log(record);
        const { responsibles, status } = record
        let manageId = []
        if (responsibles) {
          manageId = responsibles.map((item:any) => {
            return item.id
          })
        }
        const { id } = JSON.parse(sessionStorage.getItem("user")!);
        let len = 0;
        if (manageId.includes(id) && status === 1) {
          len = 1
        }
        const className = len > 0 ? "num1-color" : "num-color";
        return <span className={styles[className]}>{len}</span>;
      },
      sorter: (a:any, b: any) => b.len - a.len,
    },
  ];

  const expandedRowRender = (record: dataItem) => {
    const { content } = record;
    return <ChildrenTable type={Type} item={content} getSpecial={getSpecial} />;
  };

  const getSpecial = async () => {
    setLoading(true);
    try {
      const res = await httpUtil.getSpecial({
        progressId,
      });
      if (res.code === 200) {
        const itemList = [];
        let i = 0;
        for (const item of res.data) {
          const {
            id,
            attachment,
            design,
            atizi,
            adate,
            cdate,
            responsibles,
            bchengguo,
            bdate,
            byaoqiu,
            ctizi,
            dyaoqiu,
            ddate,
            dchengguo,
            edate,
            echengguo,
            status,
            adjustReason,
            content,
          } = item;
          itemList.push({
            key: i,
            single: design,
            responsibles,
            status,
            id,
            adate,
            cdate,
            ddate,
            edate,
            content: [
              {
                key: i,
                content,
                adjustReason,
                attachment,
                responsibles,
                status,
                atizi,
                adate,
                bchengguo,
                bdate,
                byaoqiu,
                ctizi,
                cdate,
                dyaoqiu,
                ddate,
                dchengguo,
                edate,
                echengguo,
                id,
              },
            ],
          });
          i++;
        }
        setSpecialList(itemList);
        setLoading(false);
      }
    } finally {
    }
  };

  useEffect(() => {
    getSpecial();
  }, []);

  return (
    <div>
      <Table
        className="components-table-demo-nested"
        loading={loading}
        columns={columns}
        expandable={{ expandedRowRender: (e) => expandedRowRender(e) }}
        dataSource={specialList}
        pagination={false}
      />
    </div>
  );
};
