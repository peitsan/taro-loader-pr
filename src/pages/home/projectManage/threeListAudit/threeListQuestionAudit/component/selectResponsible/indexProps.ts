import { UnitsType } from '@/redux/units/slice';

export interface SelectResponsibleProps {
  isManageModal: boolean;
  okManageModal: any;
  selectRecord: any;
  recordFlash: any;
  selectIndex: number;
  units: UnitsType;
}

export interface SendDataType {
  [propName: string]: {
    [propName: string]: any;
  };
}
