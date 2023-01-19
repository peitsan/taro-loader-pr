export interface DataType {
  key: React.Key;
  major: string;
  checkList: ExpandedDataType[];
}

export interface ExpandedDataType {
  key: React.Key;
  checkText: string;
  checkPoint: string;
  id: number;
  isCheck: number;
  progressId: number;
  major: string;
}

export interface resType {
  checkPoint: string;
  checkText: string;
  id: number;
  isCheck: number;
  progressId: number;
}

export interface res {
  res: resType[];
}

export interface tableProps {
  dataSource: DataType[];
}
