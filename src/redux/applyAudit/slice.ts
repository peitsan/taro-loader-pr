import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import httpUtil from "../../utils/httpUtil";

export interface QuestionApprovalType {
  id: number;
  progressName: string;
  projectName: string;
  superTypeName: string;
  type: string;
  typeAdjustReason: string;
  typeAdjustTime: string;
  typePlanTime: string;
}

export interface ProjectApprovalType {
  createTime: string;
  fatherName: string;
  id: number;
  managerName: string;
  progressName: string;
  projectName: string;
  superTypeName: string;
  type: string;
  typeAdjustReason: string;
  typeAdjustTime: string;
  typeName: string;
  typePlanTime: string;
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
  async () => {
    const questionTimeApply = await httpUtil.workerGetQuestionTimeApplyList();
    const projectTimeApply = await httpUtil.workerGetProjectTimeApplyList();
    const {
      data: { approvals: questionApprovals },
    } = questionTimeApply;
    const {
      data: { list: projectApprovals },
    } = projectTimeApply;

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
