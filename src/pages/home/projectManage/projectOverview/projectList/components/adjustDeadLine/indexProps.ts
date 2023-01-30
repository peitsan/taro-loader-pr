import { UnitsType } from '@/redux/units/slice';

export interface adjustDeadLineProps {
  isAdjustModal: boolean;
  okAdjustModal: any;
  selectRecord: any;
  selectIndex: number;
  units?: UnitsType;
}
