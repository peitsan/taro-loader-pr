import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd-mobile";
import httpUtil from "../../utils/httpUtil";

export interface QuestionApprovalType {
  createTime: string;
  id: number;
  progressName: string;
  projectName: string;
  superTypeName: string;
  type: string;
  typeAdjustReason: string;
  typeAdjustTime: string;
  typePlanTime: string;
  manager: {
    nickName: string;
  };
}

export interface ProjectApprovalType {
  createTime: string;
  fatherName: string;
  id: number;
  manager: {
    nickName: string;
  };
  progressName: string;
  projectName: string;
  type: string;
  adjustReason: string;
  adjustTime: string;
  planTime: string;
}

interface ApplyAuditType {
  loading: boolean;
  questionApprovals: QuestionApprovalType[];
  projectApprovals: ProjectApprovalType[];
}

const initialState: ApplyAuditType = {
  loading: true,
  questionApprovals: [],
  projectApprovals: [],
};

export const getApplyListAC = createAsyncThunk(
  "applyAudit/getApplyListAC",
  async (isFirst?: boolean) => {
    let hideLoading = () => {};
    if (isFirst) {
      hideLoading = message.loading("请求中");
    }
    const questionTimeApply = await httpUtil.workerGetQuestionTimeApplyList();
    const projectTimeApply = await httpUtil.workerGetProjectTimeApplyList();
    const {
      data: { approvals: questionApprovals },
    } = questionTimeApply;
    const {
      data: { approvals: projectApprovals },
    } = projectTimeApply;
    if (isFirst) {
      hideLoading();
    }
    return { questionApprovals, projectApprovals };
  }
);

export const applyAuditSlice = createSlice({
  name: "applyAudit",
  initialState,
  reducers: {},
  extraReducers: {
    [getApplyListAC.pending.type]: (state) => {
      state.loading = true;
    },
    [getApplyListAC.fulfilled.type]: (
      state,
      action: PayloadAction<ApplyAuditType>
    ) => {
      [state.loading, state.questionApprovals, state.projectApprovals] = [
        false,
        action.payload.questionApprovals,
        action.payload.projectApprovals,
      ];
    },
    [getApplyListAC.rejected.type]: (state, action) => {
      state.loading = false;
    },
  },
});

// export const { updateApplyAudit: updateApplyAuditAC } = applyAuditSlice.actions;
