/* import { useState, useEffect } from 'react';

const ExpensesData = (props) => {
  const [expenses, setExpenses] = useState('');
  useEffect(() => {
    fetch('./expenses.txt')
      .then((response) => response.json())
      .then((data) => setExpenses(data))
      .catch((err) => console.log('Error Reading data' + err));
  }, []);
  console.log(expenses);
  props.Onload(expenses);
  return <div></div>;
};

export default ExpensesData; */

/* useEffect(() => {
  const url = './expenses.txt';

  const fetchData = async () => {
    try {
      const response = await fetch(url);
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.log('error', error);
    }
  };

  fetchData();
}, []); */
