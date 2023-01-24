import Taro from '@tarojs/taro';
import { Picker, View, Text } from '@tarojs/components';
import { AtList, AtListItem, useHttp } from 'taro-ui';
import { useRefState } from 'hook-stash';
import React, { useEffect } from 'react';
import { UnitsType } from '../../../redux/units/slice';

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}
interface stateDo {
  value: number[];
  ranges: string[][];
  newList: any;
}

// data: UnitsType,
// placeholder: string,
// width: number | string,
// multiple: boolean = true,
interface IProps {
  data: UnitsType | any;
  placeholder: string;
  width: number | string;
  multiple: boolean | true;
}
const PersonSelector: React.FC<IProps> = props => {
  const { data, placeholder, width, multiple } = props;
  console.log('data', data);
  const onChange = e => {
    console.log(e);
  };
  const list = data;
  const [state, setState] = useRefState<stateDo>({
    value: [0, 0, 0],
    ranges: [[], []],
    newList: {},
  });
  const handlePickerShow = e => {
    setState({
      value: e.detail.value,
    });
  };
  const columnChange = e => {
    const newVal = state.value;
    newVal[e.detail.column] = e.detail.value;
    const ranges = [
      [state.newList?.units],
      // 取出单位名称
      tranUnit(state.newList),
      // 取出部门名称
      tranDepts(state.newList.units[newVal[1]]),
      // 判断区角标为0 取出员工
      state.newList.units[newVal[1]].depts.length !== 0
        ? tranWordkers(state.newList.units[newVal[1]].depts[newVal[2]])
        : ['不详'],
    ];
    // 过滤code
    // const codes = [
    //   state.newList?.districtCode,
    //   traversalCode(state.newList)[newVal[1]],
    //   traversalCode(state.newList.children[newVal[1]])[newVal[2]],
    //   state.newList.children[newVal[1]].districtCode !== '0'
    //     ? traversalCode(state.newList.children[newVal[1]].children[newVal[2]])[
    //         newVal[3]
    //       ]
    //     : '0',
    // ].filter(el => el !== '0');
    // setState({ ranges: ranges, value: newVal });
    // onChange(codes[codes.length - 1]);
  };
  // 转换单位名称
  const tranUnit = (arr: any[] | any) => {
    if (!!arr?.units) {
      console.log(1);
      return arr?.units.map(el => el.name);
      // 返回单位名称
    } else {
      return ['暂无'];
    }
  };

  // 转换部门名称
  const tranDepts = (arr: any[] | any) => {
    if (!!arr[0]?.depts) {
      return arr[0]?.depts.map(el => el.name);
      // 返回部门名称
    } else {
      return ['暂无'];
    }
  };

  // 转换员工名称
  const tranWordkers = (arr: any[] | any) => {
    if (!!arr[0]?.workers) {
      console.log(3);
      return arr[0]?.workers.map(el => el.nickname);
      // 返回部门名称
    } else {
      return ['暂无'];
    }
  };
  // 转换districtName
  // const traversal = (arr: any[] | any) => {
  //   if (!!arr?.children) {
  //     return arr?.children.map(el => el.districtName);
  //   } else {
  //     if (arr?.districtCode === '0') {
  //       return ['不详'];
  //     } else {
  //       return [arr?.districtName];
  //     }
  //   }
  // };
  // // 转换districtCode
  // const traversalCode = (arr: any[] | any) => {
  //   if (!!arr?.children) {
  //     return arr?.children.map(el => el.districtCode);
  //   } else {
  //     return [arr?.districtCode];
  //   }
  // };
  // 初始化多列数据
  const cityChange = () => {
    const newList = dataChange(list);
    const ranges = [
      [newList[0]?.name],
      tranDepts(newList),
      tranWordkers(newList[0]?.depts),
    ];
    if (!!newList) {
      setState({
        ranges: ranges,
        newList: newList,
      });
    }
    console.log('range', ranges);
    // const codes = [newList?.districtCode];
    // onChange(codes[codes.length - 1]);
    return ranges;
  };

  // 递归初始化树形数据
  const dataChange = datalist => {
    if (datalist?.units) {
      const option = { id: '0', name: '暂无' };
      datalist.units.unshift(option);
      if (datalist[0]?.units[0]?.depts) {
        const option1 = { id: '0', name: '暂无' };
        datalist[0].units[0].depts.unshift(option1);
        datalist[0].units[0].depts.map(deptlist => {
          if (deptlist?.workers) {
            const option2 = { id: '0', nickname: '不详' };
            datalist[0].units[0].depts[0].workers.unshift(option2);
          }
        });
      }
    }
    console.log('datalist', datalist);
    return datalist;
  };

  useEffect(() => {
    cityChange();
  }, [list]);
  return (
    <View>
      <Picker
        mode='multiSelector'
        value={state.value}
        range={state.ranges}
        onChange={handlePickerShow}
        onColumnChange={columnChange}>
        <View>
          {state.ranges && (
            <View>
              {state.ranges[state.value[0]]}
              {state.value[1] !== 0 && state.ranges[1][state.value[1]]}
              {state.value[2] !== 0 && state.ranges[2][state.value[2]]}
            </View>
          )}
        </View>
      </Picker>
    </View>
  );
};

export default PersonSelector;
