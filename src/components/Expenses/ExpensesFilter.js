import React from 'react';
import Card from '../UI/Card';

import './ExpensesFilter.css';

const ExpensesFilter = ({ selected, onChangeFilter, mindate }) => {
  const dropdownChangeHandler = (event) => {
    onChangeFilter(event.target.value); // onChangeFilter is props will trigger filterChangeHandler() inside ControlExpense.js pass the selected year value to it
  };
  // here is a code will generate dynamic dates inside the filter dropdown options using some calculations.
  const options = [...Array(new Date().getFullYear() - mindate + 1)];
  const optionsJSX = options.map((items, index) => {
    return (
      <option
        value={(mindate + options.length - index - 1).toString()}
        key={index}
      >
        {mindate + options.length - index - 1}
      </option>
    );
  });
  return (
    <Card className='expenses-filter'>
      <label>Filter</label>
      <select value={selected} onChange={dropdownChangeHandler}>
        {optionsJSX}
      </select>
    </Card>
  );
};

export default ExpensesFilter;
