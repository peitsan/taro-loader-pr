import { CommonEventFunction } from "@tarojs/components";

export interface DataType {
  creator: number;
  describe: string;
  files: any;
  id: number;
  point: string;
  solution: string;
  type: string;
}

export interface tabListItem {
  title: string;
}
export interface refItem {
  open: boolean | undefined;
  onClose: CommonEventFunction<any>;
  confirmDelete: CommonEventFunction<any>;
  disableDraw: Function;
  detail: boolean;
  listSort: number;
  curData: DataType;
  Data: DataType[];
}
