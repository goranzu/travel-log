import { useReducer } from "react";
import apiClient from "../api";
import { IDLE, LOADING, REJECTED, RESOLVED, URL } from "../constants";

const initialState = {
  error: "",
  status: IDLE,
};

function reducer(state, action) {
  switch (action.type) {
    case LOADING:
      return { ...initialState, status: LOADING };
    case RESOLVED:
      return { ...initialState, status: RESOLVED };
    case REJECTED:
      return { ...initialState, status: REJECTED, error: action.payload.error };
    case IDLE:
      return { ...initialState };
    default:
      throw new Error("Error in reduce");
  }
}

function usePostLocation() {
  const [state, dispatch] = useReducer(reducer, initialState);

  async function postLocation(body) {
    try {
      dispatch({ type: LOADING });
      await apiClient(URL, body);
      dispatch({ type: RESOLVED });
    } catch (error) {
      dispatch({ type: REJECTED, payload: { error: error.message } });
    }
  }

  function reset() {
    dispatch({ type: IDLE });
  }
  return [state, postLocation, reset];
}

export default usePostLocation;
