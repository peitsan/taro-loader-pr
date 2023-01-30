export interface technologyItem {
  审核内容: string;
  依据: string;
  审核意见: string | null;
  闭环情况: string | null;
  id: number;
}

export interface technologyList {
  itemList: technologyItem[];
  问题处置: string | null;
  主要建议意见: string | null;
}

export interface technologyModalProps {
  isTechModal: boolean;
  okTechModal: any;
  currentTab?: number;
  setCurrentTab?: Function;
  getTechnologyList?: any;
  sheetId?: number | null;
}

export interface technologyTableProps {
  ref: any;
  isTechModal: boolean;
  setIsTechModal: Function;
  setSelectRecord: Function;
  setCurrentTab: Function;
  setSheetId: Function;
}
export interface updateSheet {
  projectId: number;
  progressId: number;
  sheetId?: number;
  opinion?: string;
  situation?: string;
}
