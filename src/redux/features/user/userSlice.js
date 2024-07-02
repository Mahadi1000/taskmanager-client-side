import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: 'Mahadi Hasan',
  email: 'mahadi@gmail.com',
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {},
});

export default userSlice.reducer;
