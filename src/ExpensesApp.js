import React, { useState, useEffect } from 'react';
import Clock from './components/UI/Clock';
import Card from './components/UI/Card';
import Button from './components/UI/Button';
import ControlExpense from './components/ControlExpense/ControlExpense';
import Chart from './components/Chart/Chart';
import ExpenseItem from './components/Expenses/ExpenseItem';
import ErrorModal from './components/UI/ErrorModal';
import './ExpensesApp.css';
//import { writeJsonFile } from 'write-json-file';
// ExpensesApp is the head componenet, inside it the other componenets will be controled when to appear to the user ,  data will be fetched , yearly filtered, added , edited , deleted , saved back again.
const useStateWithLocalStorage = (localStorageKey, defaultValue = []) => {
  const [state, setState] = useState(
    JSON.parse(localStorage.getItem(localStorageKey)) || defaultValue
  );
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(state));
  }, [localStorageKey, state]);

  return [state, setState];
};
// the parrent component start here ExpensesApp
function ExpensesApp() {
  /* ****************************** */
  const [expenses, setExpenses] = useStateWithLocalStorage('data'); // a state to save the whole expenses data, it is an array of objects.
  const [categories, setCategory] = useStateWithLocalStorage('categories', [
    'general',
  ]);
  const [settingsValues, setSettingsValues] = useStateWithLocalStorage(
    'expensesSittings',
    [2015, '&#36;']
  );
  /* ****************************** */
  /* ****************************** */
  const settigSubmitHadler = (settingsValues) => {
    setSettingsValues(settingsValues); //if settingsvaluechanged the useeffect will add the new value to local
  };
  /* ****************************** */
  //this function onNewCategoryAdd will pass it as prop to ControlExpense.js it will be triggerd when the user click o add ategory button in the sittengs panel
  const onNewCategoryAdd = (newcategory) => {
    let existcategory = false;
    categories.forEach((item) => {
      if (item === newcategory) existcategory = true;
    });
    if (existcategory) {
      errorHandler({
        title: 'repeated category item',
        message: `you already have ${newcategory} as category`,
      });
      return;
    } else {
      setCategory([...categories, newcategory]);
    }
  };
  /* ****************************** */
  /* ****************************** */
  /* ****************************** */
  //savefile and restore Data are two fuctions response to save the restore data from the hardDisk
  const saveFile = async (blob) => {
    const a = document.createElement('a');
    a.download = '/my-expenses.txt';
    a.href = URL.createObjectURL(blob);
    //The uniform resource locators methode URL.createObjectURL() is a static method creates a DOMString containing a URL representing the object given in the parameter.
    // The URL lifetime is tied to the document in the window on which it was created. The new object URL represents the specified File object or Blob object.
    a.addEventListener('click', (e) => {
      //To release an object URL, call revokeObjectURL().
      //Call this method when you've finished using an object URL to let the browser know not to keep the reference to the file any longer.
      //a.click() on a DOM element simulates a click on the element, instead of propagation of the click event, so it's directly sent to the browser.it would be a little bit safer to move revoking of URL object to another event cycle using a timer:
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
  };
  const obj = expenses;
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: 'application/json',
  });
  /* ****************************** */
  const restoreData = () => {
    fetch('./_my-expenses.txt')
      .then((response) => response.json())
      .then((data) => setExpenses(data))
      .catch((err) => console.log('Error Reading data' + err));
  };
  /* ****************************** */
  /* ****************************** */
  /* ****************************** */
  const [error, setError] = useState(); //is a state take object of error information this inormation will decde the form of this error if it is alert or confirmtion for whch will take function to excute them if the user confirm {confirmform,Excueaction,afterexcute, cancelexcute,title,message,message1}
  const errorHandler = (errorData) => {
    setError(errorData);
  };
  /* ****************************** */
  /* ****************************** */
  const [filteredOptions, setFilteredOptions] = useState([
    new Date().getFullYear().toString(),
    'general',
  ]); // a state to save array of filtered options which be choosed by the user in ExpensesFilter.js and lifted up to ControlExpense.js then lifted up again to here.
  const FilterHandler = (selectedoptions) => {
    /* if (selectedYear instanceof Date) {
      console.log(typeof selectedYear);
    } */
    //selected year is lifted up value come through ControlExpense.js which it took it throw ExpenseFilter.js
    const filteredOptions_copy = [...filteredOptions];
    if (selectedoptions[0]) {
      filteredOptions_copy[0] = selectedoptions[0];
      setFilteredOptions(() => filteredOptions_copy);
    } else if (selectedoptions[1]) {
      filteredOptions_copy[1] = selectedoptions[1];
      setFilteredOptions(() => filteredOptions_copy);
    }
  };
  /* ****************************** */
  const filterdExpensesFunction = () => {
    if (filteredOptions[1] === 'general' || !filteredOptions[1]) {
      return expenses.filter(
        (item) => item.date.substring(0, 4) === filteredOptions[0]
      );
    } else {
      return expenses.filter(
        (item) =>
          item.date.substring(0, 4) === filteredOptions[0] &&
          item.category === filteredOptions[1]
      );
    }
  };
  const filterdExpenses = filterdExpensesFunction();
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
  const editExpenseHandler = (newTitle, newAmount, newCategory, expenseId) => {
    setExpenses((prev) => {
      return expenses.map((item) => {
        if (item.id === expenseId) {
          return {
            ...item,
            title: newTitle,
            amount: +newAmount,
            category: newCategory,
          };
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
  };
  /* ****************************** */
  /* ****************************** */
  /* ****************************** */
  let expensesItems = filterdExpenses //here is methode to take the filtered data and show the expenses inside our data by generate one <ExpenseItem/> component for each expense
    .map((item) => {
      return (
        <ExpenseItem
          expense={item} //we pass each invidual expense item
          currency={settingsValues[1]} // the used currency
          key={item.id}
          editExpense={editExpenseHandler}
          deleteExpense={deleteExpenseHandler}
          onError={errorHandler}
          categories={categories} //i have to see why i passed the whole categories 
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
      <Clock />
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
              selectedYear={filteredOptions[0]}
              settingsValues={settingsValues}
              hideShowChart={hideShowChart}
              hideControls={hideControlsHandler}
              hideShowList={hideShowList}
              sortExpensesByDate={sortExpensesByDate}
              onError={errorHandler}
              onSettingSubmit={settigSubmitHadler}
              downloadExpensesFile={() => saveFile(blob)}
              restoreData={restoreData}
              onNewCategoryAdd={onNewCategoryAdd}
              categories={categories}
            />
          )}
          {IsCharted && (
            <Chart
              expensesToChart={filterdExpenses}
              currency={settingsValues[1]}
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

/* const [categories, setCategory] = useState(
    JSON.parse(localStorage.getItem('categories')) || ['general']
  );
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]); */
/*  const [settingsValues, setSettingsValues] = useState(
    JSON.parse(localStorage.getItem('expensesSettings')) || [2015, '&#36;']
  );
  useEffect(() => {
    localStorage.setItem('expensesSettings', JSON.stringify(settingsValues));
  }, [settingsValues]); */

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
