export interface Item {
  key: React.Key;
  reason: string;
  planTime: string;
  manage: any[];
  current: string;
  code: number;
  manageId: number[];
}
export interface AccordionProps {
  data: any;
  index: number;
  setIsCheckModal?: any;
  setIsManageModal?: any;
  setSelectRecord?: any;
  setSelectIndex?: any;
  setIsAdjustModal?: any;
}
