import {
  problemsItem,
  protocolsItem,
  proceduresItem,
} from '../../../../projectOverview/projectList/projectListType/projectListType';
export interface ThreeListQuestionAuditTableProps {
  problemsItem?: problemsItem[];
  protocolsItem?: protocolsItem[];
  proceduresItem?: proceduresItem[];
  setSelectRecord?: Function;
  setIsAssignResponsibilities?: Function;
  setIsRejectModal?: Function;
  index: number;
  fresh: Function;
}


export interface tableProps {
  dataSource: any;
}