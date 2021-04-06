import { useReducer, useCallback } from 'react';

const initialState = {
    loading: false,
    error: null,
    data: null,
    extra:null,
    identifier:null
  };

// REDUCER 2 - We extract reducer 2 functionality from Ingredients to create our custom useHttp hook
// scenario: Multiple connected states
const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null, data: null, extra: null,  identifier: action.identifier};
    case 'RESPONSE':
      return { ...currentHttpState, loading: false, data: action.responseData, extra: action.extra };
    case 'ERROR':
      return { loading: false, error: action.error };
    case 'CLEAR':
      return initialState;
    default:
      throw new Error('Should not be reached!');
  }
};

// custom useHttp hook
const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
    data: null,
    extra:null,
    identifier:null
  });

  const clear = useCallback(()=>dispatchHttp ({type:'CLEAR'}), []);

  // to avoid unnecessary re-renders we use useCallback
  const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifier) => {
    dispatchHttp({ type: 'SEND', identifier:reqIdentifier});
    fetch(url, {
      method: method,
      body: body,
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        // in order to send the response to the component we added dataResponse
        // as action value
        dispatchHttp({ type: 'RESPONSE', responseData: responseData, extra:reqExtra });
      })
      .catch((error) => {
        dispatchHttp({ type: 'ERROR', error: 'Error' });
      });
  },[]);

  //Here is what the hook returns
  // it could be an object, array or any value desired
  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
    clear: clear
  };
};

export default useHttp;
