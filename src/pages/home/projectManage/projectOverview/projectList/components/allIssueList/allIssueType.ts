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
  setIsApplyUpper?: Function;
  setIsCheckModal?: Function;
  setIsManageModal?: Function;
  setIsAdjustModal?: Function;
  setIsReplyModal?: Function;
  setIsRejetModal?: Function;
  setIsPassModal?: Function;
  setSelectRecord?: Function;
  setSelectIndex?: Function;
  index: number;
  fresh: Function;
}
export interface tableProps {
  dataSource: DataType[];
}
