import Taro from '@tarojs/taro';
import { Picker, View, Text } from '@tarojs/components';
import { useRefState } from 'hook-stash';
import React, { useEffect, useState } from 'react';
import { UnitsType } from '../../../redux/units/slice';

interface stateDo {
  value: number[];
  ranges: string[][][];
  newList: any;
}
interface IProps {
  title: string;
  state: stateDo;
  setState: Function;
  data: UnitsType | any;
  placeholder: string;
  width: number | string;
  multiple: boolean | true;
}
const PersonSelector: React.FC<IProps> = props => {
  const { title, data, placeholder, width, multiple } = props;
  const list = data;
  const [firstFresh,setFirstFresh] = useState<Boolean>(true);
  const [state, setState] = useRefState<stateDo>({
    value: [0, 0, 0],
    ranges: [[], [], []],
    newList: {},
  });
  // 为了避免react父组件更新重新render对子组件选中值的影响  将子组件选中值通过父组件传入
  const handlePickerShow = e => {
    setState({
      value: e.detail.value,
    });
  };
  const columnChange = e => {
    const newVal = state.value;
    newVal[e.detail.column] = e.detail.value;
    setState({
      value: newVal,
      ranges: [
        tranUnit(state.newList),
        // 取出部门名称
        tranDepts(state.newList[newVal[0]].depts),
        // 判断区角标为0 取出员工
        state.newList[newVal[0]].depts.length !== 0
          ? tranWordkers(state.newList[newVal[0]].depts[newVal[1]].workers)
          : ['不详'],
      ],
    });
  };
  // 转换单位名称
  const tranUnit = (arr: any[] | any) => {
    if (arr.length !== 0) {
      return arr?.map(el => el.name);
      // 返回单位名称
    } else {
      return ['暂无'];
    }
  };

  // 转换部门名称
  const tranDepts = (arr: any[] | any) => {
    if (arr.length !== 0) {
      return arr.map(el => el.name);
      // 返回部门名称
    } else {
      return ['暂无'];
    }
  };

  // 转换员工名称
  const tranWordkers = (arr: any[] | any) => {
    if (arr.length !== 0) {
      return arr.map(el => el.nickname);
      // 返回部门名称
    } else {
      return ['暂无'];
    }
  };
  // 初始化多列数据
  const cityChange = () => {
    const newList = list;
    // const ranges = [
    //   tranUnit(newList),
    //   // 取出部门名称
    //   tranDepts(newList[state.value[0]].depts),
    //   // 判断区角标为0 取出员工
    //   newList[state.value[0]].depts.length !== 0
    //     ? tranWordkers(newList[state.value[0]].depts[state.value[1]].workers)
    //     : ['不详'],
    // ];
    const ranges = [
      tranUnit(newList),
      // 取出部门名称
      newList.length !== 0
      ?tranDepts(newList[0].depts)
      : ['不详'],
      // 判断区角标为0 取出员工
      newList[0].depts.length !== 0
        ? tranWordkers(newList[0].depts[0].workers)
        : ['不详'],
    ];
    // const ranges = [
    //   tranUnit(newList),
    //   // 取出部XQ门名称
    //   [],
    //   // 判断区角标为0 取出员工
    //   ['不详'],
    // ];
    console.log(ranges);
    if (!!newList) {
      setState({
        value:[0,0,0],
        ranges: ranges,
        newList: newList,
      });
    }
    return ranges;
  };

  // 递归初始化树形数据
  // const dataChange = datalist => {
  //   if (datalist) {
  //     const option = { id: '0', name: '暂无' };
  //     datalist.unshift(option);
  //     datalist.map((unitslist,unitindex) => {
  //     if (unitslist?.depts) {
  //     datalist[unitindex].depts.map((deptlist,deptid) => {
  //       const option1 = { id: '0', name: '暂无' };
  //       datalist[unitindex].units[unitindex].depts.unshift(option1);
  //       datalist[unitindex].units[unitindex].depts.map((deptlist,deptid) => {
  //         if (deptlist?.workers) {
  //           const option2 = { id: '0', nickname: '不详' };
  //           datalist[unitindex].units[unitindex].depts[deptid]?.workers.unshift(option2);
  //         }
  //       });
  //       }
  //     })
  //   })
  // }
  //   return datalist;
  // };
  const dataChange = datalist => {
    if (datalist[0]?.units) {
      const option = { id: '0', name: '暂无' };
      datalist.units.unshift(option);
      if (datalist[0]?.units[0]?.depts) {
        const option1 = { id: '0', name: '暂无' };
        datalist[0].units[0].depts.unshift(option1);
        datalist[0].units[0].depts.map(deptlist => {
          if (deptlist?.workers) {
            const option2 = { id: '0', nickname: '不详' };
            deptlist?.workers.unshift(option2);
          }
        });
      }
    }
    console.log('2');
    return datalist;
  };

  useEffect(() => {
    cityChange();
  },[data]);

  return (
    <View style={{fontSize:"18px",lineHeight:'20px', margin:'0 4%'}} onClick={()=>setFirstFresh(false)}>
      <Picker
        mode='multiSelector'
        value={state.value}
        range={state.ranges}
        onChange={handlePickerShow}
        onColumnChange={columnChange}>
        <View style={{ margin:'4% 0'}}>{title}:</View>
        <View style={{ color:'#a7a7a7'}}>
          {firstFresh == true?(<View style={{ color:'#a7a7a7',textAlign:'center'}}>{placeholder}</View>):
          (state.ranges && (
            <View>
              {state.ranges[state.value[0]]}  ->
              {state.ranges[1][state.value[1]]} ->
              {state.ranges[2][state.value[2]]}
            </View>)
          )}
        </View>
      </Picker>
    </View>
  );
};

export default PersonSelector;
