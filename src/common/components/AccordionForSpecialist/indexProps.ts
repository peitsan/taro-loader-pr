export interface Item {
  key: React.Key;
  reason: string;
  planTime: string;
  manage: any[];
  current: string;
  code: number;
  manageId: number[];
}
export interface AccordionForSpecialProps {
  data: any;
  type: number;
  getSpecial: Function;
  setIsCheckModal?: any;
  setIsManageModal?: any;
  setSelectRecord?: any;
  setSelectIndex?: any;
  setIsAdjustModal?: any;
  setIsReplyModal?: any;
  setIsRejetModal?: any;
  setIsPassModal?: any;
  setIsApplyUpper?: any;
}
