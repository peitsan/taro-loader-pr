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

export type StateType = {
  loading: boolean;
  data: {
    units: UnitsType;
    searchUnits: any;
  };
};

export interface GetUnitObjType {
  fatherId?: string;
  getTeamPerson?: boolean;
}

const initialState: StateType = {
  loading: true,
  data: {
    units: [],
    searchUnits: [],
  },
};

export const getUnitsAC = createAsyncThunk(
  "units/getUnitsAC",
  async (obj: GetUnitObjType = {}) => {
    const { fatherId, getTeamPerson = true } = obj;
    const permission = Taro.getStorageSync("permission");
    const fetch = () => {
      if (getTeamPerson && fatherId) {
        return httpUtil.getManagerProjectTeamPerson({ fatherId });
      } else {
        return permission === "admin"
          ? httpUtil.adminGetAllWorker()
          : httpUtil.managerGetAllWorker({ fatherId: Number(fatherId) });
      }
    };
    const {
      data: { units },
    } = await fetch();

    const searchUnits: ObjectType = {};
    units.forEach((unit: UnitType) => {
      searchUnits[unit.id] = {};
      unit.depts.forEach((dept: DeptType) => {
        searchUnits[unit.id][dept.id] = dept.workers.map(
          (worker: WorkerType) => worker.id
        );
      });
    });

    return { data: { units, searchUnits } };
  }
);

export const unitsSlice = createSlice({
  name: "units",
  initialState,
  reducers: {},
  extraReducers: {
    [getUnitsAC.pending.type]: (state) => {
      state.loading = true;
    },
    [getUnitsAC.fulfilled.type]: (state, action: PayloadAction<StateType>) => {
      [state.loading, state.data] = [false, action.payload.data];
    },
    [getUnitsAC.rejected.type]: (state, action) => {
      state.loading = false;
    },
  },
});

// export const { updateUserInfo: updateUserInfoAC } = unitsSlice.actions;
