import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, []);

  const addIngredientHandler = (ingredient) => {
    fetch(
      'https://react-hooks-ingredients-d4c75-default-rtdb.firebaseio.com/ingredients.json',
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { 'Content-type': 'application/json' },
      }
    ).then((response) => {
      return response.json();
    }).then(responseData =>{
      // responseData.name is how Firebase calls the automatically generated id's of elements in a table
      setUserIngredients((prevIngredients) => [
        ...prevIngredients,
        { id:responseData.name, ...ingredient },
      ]);
    });
  };

  const removeIngredientHandler = (ingredientId) => {
    setUserIngredients((prevIngredients) =>
      prevIngredients.filter((ingredient) => {
        return ingredient.id !== ingredientId;
      })
    );
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
