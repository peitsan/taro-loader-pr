export interface IColumnsItem {
  dataIndex: string;
  title: string;
  key: string;
  width?: string;
  align?: 'center' | 'left' | 'right';
  render?: (
    key: string,
    record: ISourceDadaItem,
    allItem: ISourceDadaItem[],
  ) => JSX.Element;
}

export interface IExpandable {
  expandedRowRender: (record: ISourceDadaItem) => JSX.Element;
}

export type IColumns = IColumnsItem[];

export interface ISourceDadaItem {
  [key: string]: string;
}

export type ISourceData = ISourceDadaItem[];
