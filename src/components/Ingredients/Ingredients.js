import React, { useReducer, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

//REDUCER what we retrun replaces the current state
// scenario: state depends on previous state
const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error('Should not get there!');
  }
};
// REDUCER 2
// scenario: Multiple connected states
const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {loading:true, error:null};
    case 'RESPONSE':
      return { ...currentHttpState, loading:false};
    case 'ERROR':
      return {loading:false, error:action.error};
    case 'CLEAR':
      return {...currentHttpState, error:null};
    default:
      throw new Error('Should not be reached!');
  }
};
// FUNCTIONAL COMPONENT
const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null });
  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    // setUserIngredients(filteredIngredients);
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = (ingredient) => {
    // setIsLoading(true);
    dispatchHttp({type:'SEND'});
    fetch(
      'https://react-hooks-ingredients-d4c75-default-rtdb.firebaseio.com/ingredients.json',
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { 'Content-type': 'application/json' },
      }
    )
      .then((response) => {
        // setIsLoading(false);
        dispatchHttp({type:'RESPONSE'});
        return response.json();
      })
      .then((responseData) => {
        // responseData.name is how Firebase calls the automatically generated id's of elements in a table
        // setUserIngredients((prevIngredients) => [
        //   ...prevIngredients,
        //   { id: responseData.name, ...ingredient },
        // ]);
        dispatch({
          type: 'ADD',
          ingredient: { id: responseData.name, ...ingredient },
        });
      });
  };

  const removeIngredientHandler = (ingredientId) => {
    // setIsLoading(true);
    dispatchHttp({type:'SEND'});
    fetch(
      `https://react-hooks-ingredients-d4c75-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: 'DELETE',
      }
    )
      .then((response) => {
        // setIsLoading(false);
        dispatchHttp({type:'RESPONSE'});
        // setUserIngredients((prevIngredients) =>
        //   prevIngredients.filter((ingredient) => {
        //     return ingredient.id !== ingredientId;
        //   })
        // );
        dispatch({ type: 'DELETE', id: ingredientId });
      })
      .catch((error) => {
        // setError('something went wrong');
        // setIsLoading(false);
        dispatchHttp({type:'ERROR', error: "Error"});
      });
  };

  const clearError = () => {
    // setError(null);
    dispatchHttp({type:'CLEAR'});
  };

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
