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
}
