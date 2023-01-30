import {
  issuesItem,
  problemsItem,
  protocolsItem,
  proceduresItem,
  progress,
} from '../../projectListType/projectListType';

export interface DataType {
  key: React.Key;
  index: number;
  issueOverView: string;
  item: ExpandedDataType[];
  status?: number;
  progress: progress;
  len: number;
}

export interface ExpandedDataType {
  key: React.Key;
  reason: string;
  planTime: string;
  manage: any[];
  current: string;
  code: number;
  manageId: number[];
}

export interface IProps {
  issuesItems?: issuesItem[];
  problemsItem?: problemsItem[];
  protocolsItem?: protocolsItem[];
  proceduresItem?: proceduresItem[];
  setIsCheckModal?: Function;
  setIsManageModal?: Function;
  setSelectRecord?: Function;
  index: number;
  fresh: Function;
}
export interface tableProps {
  dataSource: DataType[];
}
