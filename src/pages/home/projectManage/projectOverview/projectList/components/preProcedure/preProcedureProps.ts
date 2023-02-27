export interface DataType {
  key: React.Key;
  major: string;
}
export interface preProcedureProps {
  data: any[];
  onConfirm?: any;
  onDetail?: any;
}

export interface tableProps {
  dataSource: DataType[];
}
