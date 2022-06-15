import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  inputValue: {
    check: { checkAge: true, checkService: true, checkInfo: true, checkMarketing: false },
    verifyEmail: false,
    inputEmailId: '',
  },
  focusedInputName: {},
  isCheckAll: false,
  isDisabled: true,
  status: 'idle',
};
// join: email, emailVerifyCode, password, passwordCheck, userName, phoneNumber

export const fetchUserInfo = createAsyncThunk('mypage/fetchUserInfo', async (userId) => {
  const response = await axios.post('http://localhost:8888/mypage/fetchUserInfo', {
    userId,
  });
  return response.data.result;
});

export const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    enableClick: (state) => {
      state.isDisabled = false;
    },
    disableClick: (state) => {
      state.isDisabled = true;
    },
    onChangeInput: (state, action) => {
      const { inputValue } = state;
      const { name, value } = action.payload;
      state.inputValue = { ...inputValue, [name]: value };
      if (name === 'email' && value.includes('@')) {
        let emailIdIndex = value.indexOf('@');
        state.inputValue.inputEmailId = value.substr(0, emailIdIndex);
        action.payload.setAttribute('list', 'email-domain');
      }
      if (
        state.inputValue.email &&
        state.inputValue.verifyEmail &&
        state.inputValue.password &&
        state.inputValue.passwordCheck &&
        state.inputValue.username &&
        state.inputValue.phoneNumber
      )
        state.isDisabled = false;
      else state.isDisabled = true;
    },

    onFocusInput: (state, action) => {
      const { focusedInputName } = state;
      state.focusedInputName = { ...focusedInputName, [action.payload]: true };
    },
    onBlurInput: (state, action) => {
      const { focusedInputName } = state;
      state.focusedInputName = { ...focusedInputName, [action.payload]: false };
    },

    onCheck: (state, action) => {
      const { inputValue } = state;
      state.inputValue = {
        ...inputValue,
        check: { ...inputValue.check, [action.payload]: !inputValue.check[action.payload] },
      };
      const { checkAge, checkService, checkInfo, checkMarketing } = state.inputValue.check;
      // 약관 일일이 모두 체크하면 전체 선택 버튼도 체크
      if (checkAge && checkService && checkInfo && checkMarketing) {
        state.isCheckAll = true;
      } // 하나라도 체크 해제되면 전체 선택 버튼 해제
      else if (checkAge || checkService || checkInfo || checkMarketing) {
        state.isCheckAll = false;
      }
    },
    onCheckAll: (state) => {
      const { isCheckAll } = state;
      state.inputValue.check = isCheckAll
        ? { checkAge: false, checkService: false, checkInfo: false, checkMarketing: false }
        : { checkAge: true, checkService: true, checkInfo: true, checkMarketing: true };
      state.isCheckAll = !isCheckAll;
    },
    successVerifyEmail: (state) => {
      const { inputValue } = state;
      state.inputValue = { ...inputValue, verifyEmail: true };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUserInfo.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reviews = state.inputValue.concat(action.payload);
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {
  enableClick,
  disableClick,
  onChangeInput,
  onFocusInput,
  onBlurInput,
  onCheck,
  onCheckAll,

  successVerifyEmail,
} = formSlice.actions;

export default formSlice.reducer;
