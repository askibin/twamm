import { useReducer } from "react";
import * as R from "../reducers/trade-intervals.reducer";

export default (initialData = undefined, flag = false) => {
  const initialState = {
    data: initialData,
  };

  if (flag) return useReducer(R.reducer2, initialState);

  return useReducer(R.default, initialState);
};

export const { action } = R;
