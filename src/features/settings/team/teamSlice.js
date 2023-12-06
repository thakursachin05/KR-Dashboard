import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getTeamContent = createAsyncThunk("/team/content", async () => {
  // const response = await axios.get('/api/users?page=2', {})
  return StudentData;
});

export const teamSlice = createSlice({
  name: "team",
  initialState: {
    isLoading: false,
    team: [],
  },
  reducers: {
    addNewLead: (state, action) => {
      let { newLeadObj } = action.payload;
      // state.Team = [...state.Team, newLeadObj]
      state.team = newLeadObj;
    },

    deleteLead: (state, action) => {
      let { index } = action.payload;
      state.team.splice(index, 1);
    },
    editLead: (state, action) => {
      const { index, updatedLead } = action.payload;
      state.team[index] = updatedLead;
    }
  },

  extraReducers: {
    [getTeamContent.pending]: (state) => {
      state.isLoading = true;
    },
    [getTeamContent.fulfilled]: (state, action) => {
      state.team = action.payload;
      state.isLoading = false;
    },
    [getTeamContent.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export const { addNewMember, deleteMember, editMember } = teamSlice.actions;

export default teamSlice.reducer;
