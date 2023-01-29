import {
  QuestionApprovalType,
  ProjectApprovalType,
} from '@/redux/applyAudit/slice';

export interface IColumn {
  title: string;
  dataIndex: string;
  render?: () => JSX.Element;
}

export default interface ITable {
  column: string[];
  data: QuestionApprovalType[] | ProjectApprovalType[];
}
