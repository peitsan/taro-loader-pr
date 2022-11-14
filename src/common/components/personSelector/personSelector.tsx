import { Cascader } from "antd";
import { UnitsType } from "../../../redux/units/slice";

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}

export const PersonSelector = (
  data: UnitsType,
  placeholder: string,
  width: number | string,
  multiple: boolean = true
) => {
  const options = data.map((unit) => {
    const option: Option = {
      value: unit.id,
      label: unit.name,
      children: unit.depts.map((dept) => ({
        value: dept.id,
        label: dept.name,
        children: dept.workers.map((worker) => ({
          value: worker.id,
          label: worker.nickname,
        })),
      })),
    };
    return option;
  });

  return (
    <Cascader
      style={{ width }}
      options={options}
      multiple={multiple}
      maxTagCount="responsive"
      placeholder={placeholder}
    />
  );
};
