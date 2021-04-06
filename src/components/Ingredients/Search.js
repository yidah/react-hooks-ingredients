import React, { useEffect, useState, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

const Search = React.memo((props) => {
  //Object destructuring to control dependencies in useEffect
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();
  const {
    isLoading,
    error,
    data,
    sendRequest,
    clear,
  } = useHttp();

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

        sendRequest('https://react-hooks-ingredients-d4c75-default-rtdb.firebaseio.com/ingredients.json' +
        query, 'GET' )


      }
    }, 500);
    // useEffect cleanup function
    // this function runs BEFORE useEffect runs the next time
    return () => {
      // clear timer in javascript
      clearTimeout(timer);
    };
  }, [enteredFilter, inputRef, sendRequest]);

  // In order to handle the response from the sendRequest in above useEffect
  useEffect(()=>{
    if (!isLoading && !error && data) {
      const loadedIngrendients = [];
      for (const key in data) {
        loadedIngrendients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount,
        });
      }
      onLoadIngredients(loadedIngrendients);
    }

  }, [data,isLoading,error, onLoadIngredients])

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading ...</span> }
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
