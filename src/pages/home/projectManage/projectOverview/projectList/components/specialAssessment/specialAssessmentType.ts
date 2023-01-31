export interface IProps {
  Type: number;
  setIsApplyUpper?: Function;
  setIsCheckModal?: Function;
  setIsManageModal?: Function;
  setIsAdjustModal?: Function;
  setIsReplyModal?: Function;
  setIsRejetModal?: Function;
  setIsPassModal?: Function;
  setSelectRecord?: Function;
  setSelectIndex?: Function;
  setZxpgData?: any;
  fresh: Function;
}

export interface dataItem {
  single: string;
  content: any[];
}

export interface oneData {
  title: string;
  key: number;
}

export interface tableProps {
  dataSource: dataItem[];
}
