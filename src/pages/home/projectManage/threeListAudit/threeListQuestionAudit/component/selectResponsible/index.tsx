/* eslint-disable prettier/prettier */
import { getStorageSync } from '@tarojs/taro';
import { useEffect, useRef, useState } from 'react';
import {
  AtInputNumber,
  AtList,
  AtListItem,
  AtModal,
  AtModalAction,
  AtModalContent,
  AtModalHeader,
} from 'taro-ui';
import { Button, Picker, View } from '@tarojs/components';
import { UnitsType } from '@/redux/units/slice';
import PersonSelector from '@/common/components/personSelector/personSelector';
import { message } from '@/common/functions';
import httpUtil from '@/utils/httpUtil';
import { SelectResponsibleProps, SendDataType } from './indexProps';
import styles from './index.module.less';

const threeListName = ['problem', 'protocol', 'procedure'];
const threeArr = ['reasons', 'opinions', 'conditions']
const SelectResponsible: React.FC<SelectResponsibleProps> = selfProps => {
  const { isManageModal, okManageModal, selectRecord, recordFlash, units, selectIndex } =
    selfProps;
  const ResponserVal = useRef<any[]>([]);
  const AlerterVal = useRef<any[]>([]);
  const [AlertDeadline, setAlertDeadline] = useState<any>({});
  const [Deadline, setDeadline] = useState<any[]>([]);
  const tabs = threeArr[selectIndex]
  useEffect(()=>{
    console.log('selectRecord', selectRecord)
    
  }, [selectRecord])
 
  const onCreate = () => {
    // console.log('11', ResponserVal);
    // console.log('111', ResponserVal[0]);
    const dataSend: SendDataType = {};
    selectRecord[tabs].map((rec, recid)=>{
      const id = rec.id;
      dataSend[id] = {};
      dataSend[id]["planTime"] = new Date(Deadline[recid]).valueOf();
      dataSend[id]["responsibles"] = [
        units[ResponserVal?.current[recid]?.state.value[0]]?.depts[
          ResponserVal?.current[recid]?.state.value[1]
        ]?.workers[ResponserVal?.current[recid]?.state.value[2]]?.id,
      ];
      dataSend[id]["relevantors"] =  [
        units[AlerterVal?.current[recid]?.state.value[0]]?.depts[
          AlerterVal?.current[recid]?.state.value[1]
        ]?.workers[AlerterVal?.current[recid]?.state.value[2]]?.id,
      ];
      dataSend[id]["advanceDay"] = AlertDeadline[recid];
    })
    
    console.log('dataSend', dataSend)
    message('请求中', 'warning');
      httpUtil
        .passThreeListItem({
          itemName:threeListName[selectIndex],
          project_id: getStorageSync('projectId'),
          problem_id: selectRecord.id,
          sendData: dataSend
        })
        .then(res => {
          if (res.code === 500) {
            message('请求错误', 'error');
          } else {
            // getSpecial();
            message('请求中', 'warning');
            message('指定成功', 'success');
            okManageModal();
            recordFlash();
          }
        });
  };
  const onConfirmManage = () => {
    onCreate();
  };
  const setAlertDeadlines =(val, index)=>{
    setAlertDeadline(preADDL => {
      const updatedADDL = preADDL;
      updatedADDL[index] = val;
      return {...updatedADDL};
    });
    console.log('AlertDeadline', AlertDeadline);
  }
  const setDeadLines = (val, index) => {
    setDeadline(preDDL => {
      const updatedDDL = preDDL;
      updatedDDL[index] = val;
      return {...updatedDDL};
    });
    // setDeadline(DDL);
  }
  const MulitiResponsible: React.FC<{index:number}>= props =>{
    const idx = props.index;
    return(
      <View>
        {/* <View>{threeListName[selectIndex]+(index +1)+':'}</View> */}
      <View>
      <Picker
              mode='date'
              value='YYYY-MM-DD'
              onChange={e => {
                setDeadLines(e.detail.value, props.index);
              }}
              >
              <AtList>
                <AtListItem
                  title='计划完成时间'
                  extraText={Deadline[props.index] ? Deadline[props.index] : '请选择时间'}
                />
              </AtList>
            </Picker>
        <PersonSelector
          title='负责人'
          ref={ResponserVal.current[props.index]}
          data={units as UnitsType}
          placeholder='请选择负责人'
          width={354}
          multiple
        />
      </View>
      <View>
        <PersonSelector
          title='报警人'
          ref={AlerterVal.current[props.index]}
          data={units as UnitsType}
          placeholder='请选择报警人'
          width={354}
          multiple
        />
      </View>
      <View className={styles['reply-title']}>
        提前提醒天数:{' '}
        <AtInputNumber
          min={0}
          max={10}
          step={1}
          value={AlertDeadline[idx]}
          onChange={e => setAlertDeadlines(e, props.index)}
        />
      </View>
      </View>

    )
  }
  // 人员好像数据不太对
  const deadlineArr: SendDataType = [];
  return (
    <AtModal isOpened={isManageModal} onClose={okManageModal}>
      <AtModalHeader> 确认责任人-报警人</AtModalHeader>
      <AtModalContent>
          {!selectRecord? <>
            <View>数据为空</View>
          </>:selectRecord.len > 0?(
            (selectRecord[tabs] as any[]).map((resItem, resIndex)=>{
              return(
                <>
                  <MulitiResponsible  index={resIndex}/>
                </>
              )
            })
          ):(<View>数据为空</View>)
          }
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
