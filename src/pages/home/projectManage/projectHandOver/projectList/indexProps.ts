export interface FatherProjectType {
  id: number;
  name: string;
  scope: number;
  creater: number;
  key?: number;
}

export interface OperationProps {
  dataList: FatherProjectType;
  index: number;
}
