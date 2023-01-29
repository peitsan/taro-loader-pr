import { useRef } from 'react';
import { AtModal, AtModalAction, AtModalContent, AtModalHeader } from 'taro-ui';
import { Button, View } from '@tarojs/components';
import { useSelector } from '@/redux/hooks';
import { UnitsType } from '@/redux/units/slice';
import PersonSelector from '@/common/components/personSelector/personSelector';
import { SelectResponsibleProps } from './indexProps';
import styles from './index.module.less';

const SelectResponsible: React.FC<SelectResponsibleProps> = selfProps => {
  const { isManageModal, okManageModal } = selfProps;
  const units = useSelector(state => state.units.data.units);
  const searchUnits = useSelector(state => state.units.data.searchUnits);
  const ResponserVal = useRef();
  const AlerterVal = useRef();
  const onConfirmManage = () => {
    okManageModal();
  };
  return (
    <AtModal isOpened={isManageModal} onClose={okManageModal}>
      <AtModalHeader> 确认责任人-报警人</AtModalHeader>
      <AtModalContent>
        <View className='reply-wrapper'>
          <PersonSelector
            title='负责人'
            ref={ResponserVal}
            data={units as UnitsType}
            placeholder='请选择负责人'
            width={354}
            multiple
          />
        </View>
        <View className='reply-wrapper'>
          <PersonSelector
            title='报警人'
            ref={AlerterVal}
            data={units as UnitsType}
            placeholder='请选择报警人'
            width={354}
            multiple
          />
        </View>
        <View className='reply-wrapper'>
          {/* <Picker title='提前提醒天数'></Picker> */}
        </View>
      </AtModalContent>
      <AtModalAction>
        {' '}
        <Button onClick={okManageModal}>取消</Button>
        <Button onClick={onConfirmManage}>确定</Button>{' '}
      </AtModalAction>
    </AtModal>
  );
};
export default SelectResponsible;
