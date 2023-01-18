export interface IProps {
  Type: number;
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
