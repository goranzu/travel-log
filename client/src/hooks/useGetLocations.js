import { useCallback, useReducer } from "react";
import apiClient from "../api";
import { IDLE, LOADING, REJECTED, RESOLVED, URL } from "../constants";

const initialState = {
  data: [],
  error: "",
  status: IDLE,
};

function reducer(state, action) {
  switch (action.type) {
    case LOADING:
      return { ...initialState, status: LOADING };
    case RESOLVED:
      return { ...initialState, status: RESOLVED, data: action.payload.data };
    case REJECTED:
      return { ...initialState, status: REJECTED, error: action.payload.error };
    case IDLE:
      return { ...initialState };
    default:
      throw new Error("Error in reduce");
  }
}

function useGetLocations() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const query = useCallback(async function fetchLocations() {
    try {
      dispatch({ type: LOADING });
      const { data } = await apiClient(URL);
      dispatch({ type: RESOLVED, payload: { data } });
    } catch (error) {
      dispatch({ type: REJECTED, payload: { error: error.message } });
    }
  }, []);

  return [state, query];
}

export default useGetLocations;
