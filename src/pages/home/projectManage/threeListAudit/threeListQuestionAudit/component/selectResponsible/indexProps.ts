import { UnitsType } from '@/redux/units/slice';

export interface SelectResponsibleProps {
  isManageModal: boolean;
  okManageModal: any;
  selectRecord: any;
  selectIndex: number;
  units: UnitsType;
}
