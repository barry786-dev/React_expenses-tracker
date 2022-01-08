import React from 'react';
import Card from '../UI/Card';

import './ExpensesCategory.css';

const ExpensesCategory = ({ slectedCategory, categories, onChangeCategory }) => {
  const categoryDropdownChangeHandler = (event) => {
    onChangeCategory(event.target.value); // onChangeFilter is props will trigger filterChangeHandler() inside ControlExpense.js
    //console.log(event.target.value);
  };
  // here is a code will generate dynamic categories inside the category dropdown options using some calculations.
  //const options = [...Array(new Date().getFullYear() - mindate + 1)];
  const optionsJSX = categories.map((item) => {
    return (
      <option value={item} key={item}>
        {item}
      </option>
    );
  });
  return (
    <Card className='expenses-category'>
      <label>Category</label>
      <select value={slectedCategory} onChange={categoryDropdownChangeHandler}>
        {optionsJSX}
      </select>
    </Card>
  );
};

export default ExpensesCategory;
