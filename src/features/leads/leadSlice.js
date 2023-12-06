import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { StudentData } from "./StudentData";

export const getLeadsContent = createAsyncThunk("/leads/content", async () => {
  // const response = await axios.get('/api/users?page=2', {})
  return StudentData;
});

export const leadsSlice = createSlice({
  name: "leads",
  initialState: {
    isLoading: false,
    leads: [],
    memberDeleted: false,
    memberStatus: "",
    leadDeleted: false,
  },
  reducers: {
    addNewLead: (state, action) => {
      let { newLeadObj } = action.payload;
      // state.leads = [...state.leads, newLeadObj]
      state.leads = newLeadObj;
    },

    deleteLead: (state, action) => {
      let { index } = action.payload;
      state.leads.splice(index, 1);
    },
    editLead: (state, action) => {
      const { index, updatedLead } = action.payload;
      state.leads[index] = updatedLead;
    },
    sliceMemberDeleted: (state, action) => {
      state.memberDeleted = action.payload;
    },
    sliceMemberStatus: (state, action) => {
      state.memberStatus = action.payload;
    },
    sliceLeadDeleted: (state, action) => {
      state.leadDeleted = action.payload;
    },
  },

  extraReducers: {
    [getLeadsContent.pending]: (state) => {
      state.isLoading = true;
    },
    [getLeadsContent.fulfilled]: (state, action) => {
      state.leads = action.payload;
      state.isLoading = false;
    },
    [getLeadsContent.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export const {
  addNewLead,
  deleteLead,
  editLead,
  sliceMemberDeleted,
  sliceMemberStatus,
  sliceLeadDeleted,
} = leadsSlice.actions;

export default leadsSlice.reducer;
