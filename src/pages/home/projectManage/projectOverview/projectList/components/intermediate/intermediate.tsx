// import { Badge, Table } from "antd-mobile";
// import type { ColumnsType } from "antd-mobile/lib/table";
import Taro from '@tarojs/taro';
import React, { useEffect, useState } from 'react';
import { DataType, ExpandedDataType, resType, res } from './intermediateType';
import httpUtil from '../../../../../../../utils/httpUtil';
import styles from './intermediate.module.css';
import { View } from '@tarojs/components';

export const Intermediate: React.FC = () => {
  const [mediateList, setMediateList] = useState<any[]>([]);
  const projectId = Taro.getStorageSync('projectId');
  const progressId = Taro.getStorageSync('progressId');
  // 列表loading
  const [loading, setLoading] = useState(true);

  const getMediateList = async () => {
    try {
      const res = await httpUtil.mediateInspection({
        projectId: projectId!,
        progressId: progressId!,
      });
      if (res.code === 200) {
        setMediateList(res.data);
        setLoading(false);
      }
    } finally {
    }
  };

  useEffect(() => {
    getMediateList();
  }, []);

  const expandedRowRender = (record: DataType) => {
    const { checkList } = record;
    console.log(checkList);
    const columns: ColumnsType<ExpandedDataType> = [
      { title: '序号', dataIndex: 'index', key: 'index', width: '6%' },
      {
        title: '检查内容',
        dataIndex: 'checkText',
        key: 'checkText',
        width: '18%',
      },
      { title: '检查要点', dataIndex: 'checkPoint', key: 'checkPoint' },
      {
        title: '状态',
        dataIndex: 'isCheck',
        key: 'isCheck',
        width: '7%',
        render: (text: number) => {
          const className = text === 0 ? 'noCheck' : 'checked';
          return (
            <View className={styles[className]}>
              {text === 0 ? '未审核' : '已审核'}
            </View>
          );
        },
      },
    ];

    const data = [];
    for (let i = 0; i < checkList.length; i++) {
      const { checkPoint, checkText, id, isCheck, major, progressId } =
        checkList[i];
      data.push({
        key: i,
        index: i + 1,
        checkPoint,
        checkText,
        id,
        isCheck,
        major,
        progressId,
      } as never);
    }
    return <></>
    {/* <Table columns={columns} dataSource={data} pagination={false} />; */}
  };

  const columns: ColumnsType<DataType> = [
    { title: '专业', dataIndex: 'major', key: 'major' },
  ];

  const data: DataType[] = [];
  for (let i = 0; i < mediateList.length; i++) {
    if (mediateList[i].length !== 0) {
      data.push({
        key: i,
        major: mediateList[i][0].major,
        checkList: mediateList[i],
      });
    }
  }

  const Table:React.FC<tableProps>=(tableProps)=>{
    const { dataSource } = tableProps;
    return(
      <>
      </>
    );
  }
  return (
    <>
      <Table/>
    </>
    // <Table
    //   className='components-table-demo-nested'
    //   columns={columns}
    //   expandable={{ expandedRowRender }}
    //   dataSource={data}
    //   loading={loading}
    // />
  );
};
