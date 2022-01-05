import React, { useState, useEffect } from 'react';
import Clock from './components/Clock';
// import ExpensesData from './Data/ExpensesData';
import Card from './components/UI/Card';
import Button from './components/UI/Button';
import ControlExpense from './components/ControlExpense/ControlExpense';
import Chart from './components/Chart/Chart';
import ExpenseItem from './components/Expenses/ExpenseItem';
import ErrorModal from './components/UI/ErrorModal';
import './ExpensesApp.css';
//import { writeJsonFile } from 'write-json-file';
// ExpensesApp is the head componenet, inside it the other componenets will be controled when to appear to the user ,  data will be fetched , yearly filtered, added , edited , deleted , saved back again
// let sorted = 'newest_first';
const useStateWithLocalStorage = (localStorageKey, defaultValue = []) => {
  const [state, setState] = useState(
    JSON.parse(localStorage.getItem(localStorageKey)) || defaultValue
  );
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(state));
  }, [localStorageKey,state]);

  return [state, setState];
};

function ExpensesApp() {
  /* ****************************** */
  const [expenses, setExpenses] = useStateWithLocalStorage('data'); // a state to save the whole expenses data, it is an array of objects

  const saveFile = async (blob) => {
    const a = document.createElement('a');
    a.download = '/my-expenses.txt';
    a.href = URL.createObjectURL(blob);
    a.addEventListener('click', (e) => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
  };
  const obj = expenses;
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: 'application/json',
  });

  const restoreData = () => {
    fetch('./_my-expenses.txt')
      .then((response) => response.json())
      .then((data) => setExpenses(data))
      .catch((err) => console.log('Error Reading data' + err));
  };
  /* ****************************** */
  const [error, setError] = useState();
  const errorHandler = (errorData) => {
    setError(errorData);
  };
  const [sittingsValues, setSittingsValues] = useState(
    JSON.parse(localStorage.getItem('expensesSittings')) || [(2015, '&#36;')]
  );
  const sittigSubmitHadler = (sittingsValues) => {
    setSittingsValues(sittingsValues);
  };
  useEffect(() => {
    localStorage.setItem('expensesSittings', JSON.stringify(sittingsValues));
  }, [sittingsValues]);
  /* ****************************** */

  /* ****************************** */
  // const [filterdExpenses, setFilterExpenses] = useState([]);
  const [filteredYear, setFilteredYear] = useState(
    new Date().getFullYear().toString()
  ); // a state to save the filtered year which be chosed by the user in ExpensesFilter.js and lifted up to ControlExpense.js then lifted up again to here.
  const FilterHandler = (selectedYear) => {
    //selected year is lifted up value come through ControlExpense.js which it took it throw ExpenseFilter.js
    setFilteredYear(() => selectedYear);
  };
  /* ****************************** */
  /* ****************************** */
  //controlsPanel && hideControls are behinde the logic of what shoud appear on the secreen according to the user perferences
  const [controlsPanel, setControlsPanel] = useState(false);
  const showControlsPanelHandler = () => {
    setControlsPanel(true);
    setHideControls(false);
  };
  const [hideControls, setHideControls] = useState(false);
  const hideControlsHandler = () => {
    setControlsPanel(false);
    setHideControls(true);
  };
  /* ****************************** */
  /* ****************************** */
  const [IsCharted, setIsCharted] = useState(true);
  const hideShowChart = () => {
    setIsCharted(!IsCharted);
  };
  /* ****************************** */
  /* ****************************** */
  const [IsListed, setIsListed] = useState(true);
  const hideShowList = () => {
    setIsListed(!IsListed);
  };
  /* ****************************** */
  /* ****************************** */
  const submitNewExpenseHandler = (newexpense) => {
    //newexpense parameter is lifted up to here by ControlExpense.js
    setExpenses((prev) => {
      return [newexpense, ...prev];
    });
  };
  /* ****************************** */
  /* ****************************** */
  const editExpenseHandler = (newTitle, newAmount, expenseId) => {
    setExpenses((prev) => {
      return expenses.map((item) => {
        if (item.id === expenseId) {
          return { ...item, title: newTitle, amount: +newAmount };
        }
        return item;
      });
    });
  };
  /* ****************************** */
  /* ****************************** */
  const deleteExpenseHandler = (expenseId) =>
    setExpenses((prev) => expenses.filter((item) => item.id !== expenseId));
  /* ****************************** */
  /* ****************************** */
  /* ****************************** */
  /* ****************************** */
  const filterdExpenses = expenses.filter(
    (item) => item.date.substring(0, 4) === filteredYear
  );
  /* ****************************** */
  /* ****************************** */
  const sortExpensesByDate = (sort_direction) => {
    setExpenses((prev) =>
      [...prev].sort((a, b) => {
        if (sort_direction === 'down') {
          return new Date(b.date) - new Date(a.date);
        } else {
          return new Date(a.date) - new Date(b.date);
        }
      })
    );

    /* if (sorted === 'newest_first') {
      sorted = 'oldest_first';
    } else {
      sorted = 'newest_first';
    } */
  };
  /* ****************************** */
  /* ****************************** */
  /* ****************************** */
  let expensesItems = filterdExpenses //here is methode to filter and show the expenses inside our data by generate one <ExpenseItem/> component for each expense
    .map((item) => {
      return (
        <ExpenseItem
          expense={item}
          currency={sittingsValues[1]}
          key={item.id}
          editExpense={editExpenseHandler}
          deleteExpense={deleteExpenseHandler}
          onError={errorHandler}
        />
      );
    });
  /* ****************************** */
  /* ****************************** */
  /* ****************************** */
  // fallback meesege to appear if three was no data in certain choosen year
  if (expensesItems.length === 0)
    expensesItems = (
      <h2 className='fallback'>No expenses in this selected year</h2>
    );
  return (
    <Card className='expenses'>
      {/* <Clock /> */}
      {error && (
        <ErrorModal
          confirmForm={error.confirmForm}
          title={error.title}
          message={error.message}
          message2={error.message2}
          onConfirmClick={error.ExcuteAction}
          afterExcuteAction={error.afterExcuteAction}
          cancelExcuteAction={error.cancelExcuteAction}
          onConfirm={() => {
            errorHandler(null);
          }}
        />
      )}
      {!controlsPanel && (
        <div>
          <Button type='button' onClick={showControlsPanelHandler}>
            Show Expenses Control Panel
          </Button>
        </div>
      )}
      {(controlsPanel || hideControls) && (
        <Card className='expenses'>
          {!hideControls && controlsPanel && (
            <ControlExpense
              onSubmit={submitNewExpenseHandler}
              onFilter={FilterHandler}
              selectedYear={filteredYear}
              sittingsValues={sittingsValues}
              hideShowChart={hideShowChart}
              hideControls={hideControlsHandler}
              hideShowList={hideShowList}
              sortExpensesByDate={sortExpensesByDate}
              onError={errorHandler}
              onSittingSubmit={sittigSubmitHadler}
              downloadExpensesFile={() => saveFile(blob)}
              restoreData={restoreData}
            />
          )}
          {IsCharted && (
            <Chart
              expensesToChart={filterdExpenses}
              currency={sittingsValues[1]}
            />
          )}
          {IsListed && <ul>{expensesItems}</ul>}
        </Card>
      )}
    </Card>
  );
  // return React.createElement(Card, { className: 'expenses' }, expensesItems);
}
export default ExpensesApp;

//Data Example
/* const expenses = [
  {
    "title": "car test",
    "id": "1641328811090",
    "amount": 175,
    "date": "2022-01-03"
  },
  {
    "title": "new car",
    "amount": 200,
    "date": "2022-01-01",
    "id": "1641117670502"
  },
  {
    "title": "my wife car",
    "amount": 350,
    "date": "2021-01-05",
    "id": "1641065433663"
  },
  {
    "title": "my son car",
    "amount": 250,
    "date": "2021-02-10",
    "id": "1641065455981"
  },
  {
    "title": "my daughter car",
    "amount": 270,
    "date": "2021-05-12",
    "id": "1641065491268"
  },
  {
    "title": "my mother car",
    "amount": 240,
    "date": "2021-11-15",
    "id": "1641065520627"
  }
] */

/* const editHandler = (expenseitem) => {
    const editedExpnses = expenses.map((item) => {
      if (item.id === expenseitem.id) {
        return expenseitem;
      }
      return item;
    });
    const fs = require('browserify-fs');
    fs.writeFile('./expenses.txt', editedExpnses);
    console.log(editedExpnses);
  }; */

// return (
//   <div>
//     <h1 className='love'>How to write without JSX</h1>
//     <ExpenseItem items={expenses} />
//   </div>
// );
// return React.createElement(
//   'div',
//   {},
//   React.createElement('h1', { className: 'love' }, 'How to write without JSX'),
//   React.createElement(ExpenseItem, { items: expenses })
// );

/* useEffect(() => {
    // we use effect here to fetch data first time from the local text file in the local disk.
    fetch('/expenses/')
      .then((response) => response.json())
      .then((data) => setExpenses(data))
      .catch((err) => console.log('Error Reading data' + err));
  }, []); */

/*  useEffect(() => {
    const url = '/expenses/';
    post(url, expenses);
  }, [expenses]); */
/* const highlight = (node) => {
  if (document.body.createTextRange) {
    const range = document.body.createTextRange();
    range.moveToElementText(node);
    range.select();
  } else if (window.getSelection) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    console.warn('Could not select text in node: Unsupported browser.');
  }
}; */
