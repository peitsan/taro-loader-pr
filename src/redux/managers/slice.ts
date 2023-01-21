<<<<<<< HEAD
import { deepClone } from '../../common/functions/deepClone';
=======
import { deepClone } from "../../common/functions/deepClone";
>>>>>>> 20eee0f7e4cb504d5d3efac60e0656f3ff5f1278
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import httpUtil from "../../utils/httpUtil";

interface ObjectType {
  [propName: string | number]: any;
}

export interface WorkerType {
  id: number;
  phone: string;
  nickname: string;
  identity?: string;
}

export interface DeptType {
  id: number;
  name: string;
  workers: WorkerType[];
}

export interface UnitType {
  id: number;
  name: string;
  depts: DeptType[];
}

export type UnitsType = UnitType[];

export interface FlatManagerType {
  name: string;
  unit: string;
  dept: string;
  phone: string;
  userId: number;
}

export type StateType = {
  loading: boolean;
  data: {
    managers: UnitsType;
    searchManagers: any;
    otherManagers: UnitsType;
    flatManagers: FlatManagerType[];
  };
};

const initialState: StateType = {
  loading: true,
  data: {
    managers: [],
    searchManagers: [],
    otherManagers: [],
    flatManagers: [],
  },
};

export const getManagersAC = createAsyncThunk(
  "managers/getManagersAC",
  async () => {
    const {
      data: { units },
    } = await httpUtil.getManagers();
    const userId = Number(Taro.getStorageSync("id")!);
    const flatManagers: FlatManagerType[] = [];
    for (let unit of units) {
      const { name: unitName, depts } = unit;
      for (let dept of depts) {
        const { name: deptName, workers } = dept;
        for (let worker of workers) {
          const { nickname: workerName, phone, id: userId } = worker;
          const teamPerson: FlatManagerType = {
            name: workerName,
            unit: unitName,
            dept: deptName,
            phone,
            userId,
          };
          flatManagers.push(teamPerson);
        }
      }
    }
    const otherManagers = deepClone<UnitsType>(units as UnitsType);
    for (let unit of otherManagers) {
      for (let dept of unit.depts) {
        dept.workers = dept.workers.filter(
          (worker: WorkerType) => worker.id !== userId
        );
      }
    }
    const searchManagers: ObjectType = {};
    units.forEach((unit: UnitType) => {
      searchManagers[unit.id] = {};
      unit.depts.forEach((dept: DeptType) => {
        searchManagers[unit.id][dept.id] = dept.workers.map(
          (worker: WorkerType) => worker.id
        );
      });
    });

    return {
      data: { managers: units, flatManagers, otherManagers, searchManagers },
    };
  }
);

export const managersSlice = createSlice({
  name: "managers",
  initialState,
  reducers: {},
  extraReducers: {
    [getManagersAC.pending.type]: (state) => {
      state.loading = true;
    },
    [getManagersAC.fulfilled.type]: (
      state,
      action: PayloadAction<StateType>
    ) => {
      [state.loading, state.data] = [false, action.payload.data];
    },
    [getManagersAC.rejected.type]: (state, action) => {
      state.loading = false;
    },
  },
});
