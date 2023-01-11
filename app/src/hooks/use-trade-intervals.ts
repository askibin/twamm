import { useReducer } from "react";
import * as R from "../reducers/trade-intervals.reducer";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (initialData = {}) => {
  /*
   *const initialState = {
   *  data: initialData,
   *};
   */

  const { initialState } = R;

  return useReducer(R.default, initialState);
};

export const { action } = R;
