/* 
  该工具函数专门用于 Form表单中对 三级嵌套的选择 获取的数据格式进行转换
  转换成后端接口所需的 id数组格式
*/
export const transPersons = (Arr: any[], searchUnits: any) => {
  const persons: number[] = [];
  Arr.forEach((item: any) => {
    if (item.length === 3) {
      persons.push(item[2]);
    } else if (item.length === 2) {
      persons.push(...searchUnits[item[0]][item[1]]);
    } else if (item.length === 1) {
      const UnitAllWorker: number[] = Object.values<number>(
        searchUnits[item[0]],
      ).flat();
      persons.push(...UnitAllWorker);
    }
  });
  return persons;
};
