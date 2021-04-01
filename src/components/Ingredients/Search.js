import React, { useEffect, useState, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo((props) => {
  //Object destructuring to control dependencies in useEffect
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      // enteredFilter : entered value when we set the timer
      // inputRef.current.value : current value as it was declared outside the closure
      if (enteredFilter === inputRef.current.value) {
        // preparing query as expected by Firebase
        const query =
          enteredFilter.length === 0
            ? ''
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch(
          'https://react-hooks-ingredients-d4c75-default-rtdb.firebaseio.com/ingredients.json' +
            query
        )
          .then((response) => response.json())
          .then((responseData) => {
            const loadedIngrendients = [];
            for (const key in responseData) {
              loadedIngrendients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount,
              });
            }
            props.onLoadIngredients(loadedIngrendients);
          });
      }
    }, 500);
    // useEffect cleanup function 
    // this function runs BEFORE useEffect runs the next time
    return () => {
      // clear timer in javascript
      clearTimeout(timer);
    };
  }, [enteredFilter, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={(event) => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
