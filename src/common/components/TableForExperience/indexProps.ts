export interface DataType {
  creator: number;
  describe: string;
  files: any;
  id: number;
  point: string;
  solution: string;
  type: string;
}
export interface TableForExperienceProps {
  data: DataType[];
  onConfirm: Function;
  onDetail: Function;
}

export interface OperationProps {
  dataList: DataType;
  index: number;
}
