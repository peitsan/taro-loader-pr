export interface DataType {
  creator: number;
  describe: string;
  files: any;
  id: number;
  point: string;
  solution: string;
  type: string;
}
export interface TypicalExperienceDetailProps {
  data: DataType | undefined;
  open: boolean;
  onClose: Function;
}

export interface OperationProps {
  dataList: DataType;
  index: number;
}
