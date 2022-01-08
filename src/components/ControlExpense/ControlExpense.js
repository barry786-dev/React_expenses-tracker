import React, { useState, useRef } from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import ExpensesFilter from '../Expenses/ExpensesFilter';
import ExpensesCategory from '../Expenses/ExpensesCategory';
import './ControlExpense.css';
let list_button_value = 'Hide-List';
let category_to_add = 'general';
/* ****************************** */
/* ****************************** */
// controlExpenses will be response to catch the user actions like submit new expense or filter, or hide some UI components , or sorting the expenses.
const ControlExpense = ({
  onSubmit,
  onFilter,
  selectedYear,
  sittingsValues,
  hideShowChart,
  hideControls,
  hideShowList,
  sortExpensesByDate,
  onError,
  onSittingSubmit,
  downloadExpensesFile,
  restoreData,
  onNewCategoryAdd,
  categories,
}) => {
  /* ****************************** */
  /* ****************************** */
  const filterChangeHandler = (selectedYear) => {
    onFilter([selectedYear,null]); //onFilter is a prop will triger FilterHandler() in ExpensesApp.js
  };
  /* ****************************** */
  /* ****************************** */
  const [newexpense, setNewexpense] = useState({}); // a state to save any new expense entired by the form
  const expenseChangeHandler = (e) => {
    //this function will gather the data when any new data expense start to be entierd by the user, it will creat object which include this data and safe it in the state (newexpense)
    if (e.target.name === 'title') {
      setNewexpense((prev) => {
        return { ...prev, title: e.target.value };
      });
    } else if (e.target.name === 'amount') {
      setNewexpense((prev) => {
        return { ...prev, amount: +e.target.value };
      });
    } else if (e.target.name === 'date') {
      setNewexpense((prev) => {
        return { ...prev, date: e.target.value };
      });
    }
    setNewexpense((prev) => {
      return { ...prev, id: Date.now().toString()};
    });
  };
  /* ****************************** */
  const onChangeCategoryHandler = (category) => {
    setNewexpense((prev) => {
      return { ...prev, category: category };
    });
    category_to_add = category;
    onFilter([null, category]);
    /* setNewexpense((prev) => {
      return { ...prev, category: category };
    }); */
  };
  /* ****************************** */
  const passNewExpenseHandler = (e) => {
    //this function will check if the newexpense state has proper new exense without any mistakes from the user, then pass this new expense to onSubmit as parameter, finally will reset the state of newexpense to empty the field of the user form.
    e.preventDefault();
    const checkvalidty = ['title', 'amount', 'id', 'date'];
    if (checkvalidty.every((item) => newexpense.hasOwnProperty(item))) {
      console.log(newexpense);
      onSubmit(newexpense); //onSubmit is props will triger submitNewExpenseHandler() in ExpensesApp.js
    } else {
      //here you can check for the invalid entieres and alarm the user in details
      //alert('you need to fill all fields');
      //onError is a prop
      onError({
        title: 'Invalid inputs',
        message: 'you need to fill all fields, do not leave any empty value',
      });
    }
    setNewexpense({ title: '', amount: '', date: '' });
  };
  /* ****************************** */
  /* ****************************** */
  const chartOnClickHandler = () => {
    hideShowChart();
  };
  const closeControlsHandler = () => {
    hideControls();
  };
  const listOnClickHandler = () => {
    if (list_button_value === 'Hide-List') {
      list_button_value = 'Show-List';
    } else {
      list_button_value = 'Hide-List';
    }
    hideShowList();
  };

  const sortonClickHandler = (sort_direction) => {
    sortExpensesByDate(sort_direction);
  };
  const [sittings, setSittings] = useState(false);
  const sittingsIconOnClickHandler = () => {
    setSittings(!sittings);
  };
  // const [sittingsValues, setSittingsValues] = useState([2015, '&#36;']);
  const sittingSaveSubmitHandler = (e) => {
    e.preventDefault();
    onSittingSubmit([e.target.year.value, e.target.currency.value]);
    //setSittingsValues([e.target.year.value, e.target.currency.value]);
  };
  const myCategoryInput = useRef(null);
  //const categoryArr = [];

  const addCategoryClickHandler = () => {
    //categoryArr.push(myCategoryInput.current.value);
    onNewCategoryAdd(myCategoryInput.current.value);
    myCategoryInput.current.value = '';
  };
  const downloadExpensesonClickHandler = () => {
    downloadExpensesFile();
    onError({
      title: 'Data is downloaded',
      message:
        'your expenses are downloaded to your default browser download folder, the file name is my-expenses.txt, please we recomend you strongly to move the file to other folder where you can keep it safe, if you lost your expenses information for any reason or if you want to use the expenses app on other machine, and you want to start to get all the expenses back again, then follow these steps exactly: 1- copy my-expenses.txt to your expenses app root folder 2- start the expenses App 3- go to sittings 4- press Up Load button. and you will get all the data from my-expenses.txt back. please after you restore your data , you have to delete the file my-expenses.txt from your expenses app root folder, it is insecure to keep it there after restoring your data, if you are not sure about how to restore your data exactly and you need help please contact our customer support at : 015784446611 or Email:',
      message2: <a href='mailto:mbrsyr@yahoo.com'>mbrysr@yahoo.com</a>,
    });
  };
  const modalDataRestored = () => {
    onError({
      title: 'Data restored successfully!',
      message: `Data restored successfully!
        you have to delete the file my-expenses.txt from your expenses app root folder, it is insecure to keep it there , any other click by mistake on the button Up Load will restore all the data which inside my-expenses again which maybe is old in that moment, please do not use Up Load button at all if you are not sure exactly what you are doing . if you need help please contact our customer support at : 015784446611 or Email:`,
      message2: <a href='mailto:mbrsyr@yahoo.com'>mbrysr@yahoo.com</a>,
    });
  };
  const modalDataRestoredCancel = () => {
    onError({
      title: 'Restore action is Cancelled!',
      message:
        'Restore action is Cancelled!  if you need help please contact our customer support at : 015784446611 or Email:',
      message2: <a href='mailto:mbrsyr@yahoo.com'>mbrysr@yahoo.com</a>,
    });
  };
  const uploadExpensesonClickHandler = () => {
    onError({
      title: 'Attention , Retrieval of information may be insecure',
      message: `you are going to restore data from a file, if the restored file has older version than your current data then you will lose the new data, if you are not sure what you are doing exactly, please cancel this action and do not press confirm, if you need help please contact our customer support at : 015784446611 please after you restore your data , you have to delete the file my-expenses.txt from your expenses app root folder, it is insecure to keep it there , any other click by mistake on the button Up Load will restore all the data which inside my-expenses again which maybe is old in that moment, please do not use Up Load button at all if you are not sure exactly what you are doing . if you need help please contact our customer support at : 015784446611 or Email:`,
      message2: <a href='mailto:mbrsyr@yahoo.com'>mbrysr@yahoo.com</a>,
      confirmForm: true,
      ExcuteAction: restoreData,
      afterExcuteAction: modalDataRestored,
      cancelExcuteAction: modalDataRestoredCancel,
    });
  };
  //useEffect(() => onSittingSubmit(sittingsValues), [sittingsValues]);
  //this is pure js to take some dates values to use them in our App
  const date = new Date();
  const maxdate = date.toISOString().substring(0, 10);
  const maxyear = date.toISOString().substring(0, 4);
  const mindate = +sittingsValues[0];
  return (
    <Card className='new-expense'>
      {sittings && (
        <Card>
          <form
            className='new-expense__sittings-form'
            onSubmit={sittingSaveSubmitHandler}
          >
            <div className='new-expense__sittings-inputs'>
              <label htmlFor='year' className='year_label'>
                starting year
              </label>
              <input
                type='number'
                name='year'
                id='year'
                min='2015'
                max={maxyear}
                placeholder='2015'
                defaultValue={sittingsValues[0]}
              />
              <label htmlFor='currency'>currency</label>
              <select
                name='currency'
                id='currency'
                className='sitting-year__select'
                defaultValue={sittingsValues[1]}
              >
                <option value='&#36;'>&#36; US-Dollar</option>
                <option value='&euro;'>&euro; Euro</option>
                <option value='&#8355;'>&#8355; CHF</option>
                <option value='&#163;'>&#163; Pound</option>
              </select>
              <div>
                <Button type='submit' className='sittings-button'>
                  Save
                </Button>
              </div>
              <div>
                <label htmlFor='category' className='category_label'>
                  Add Category
                </label>
                <input
                  type='text'
                  name='category'
                  id='category'
                  min=''
                  max=''
                  placeholder='Grocery'
                  ref={myCategoryInput}
                />
                <Button
                  type='button'
                  className='category-button'
                  onClick={addCategoryClickHandler}
                >
                  Add category
                </Button>
              </div>
            </div>
            <div className='new-expense__sittings-controls'>
              <Button
                type='button'
                className='button'
                onClick={downloadExpensesonClickHandler}
              >
                Download
              </Button>
              <Button
                type='button'
                className='button'
                onClick={uploadExpensesonClickHandler}
              >
                Up Load
              </Button>
            </div>
          </form>
        </Card>
      )}
      <div className='close_it' onClick={closeControlsHandler}></div>
      <i
        className='fa fa-gear fa-spin'
        style={{ style: 'font-size:25px' }}
        onClick={sittingsIconOnClickHandler}
      ></i>
      <form className='new-expense__form' onSubmit={passNewExpenseHandler}>
        <div className='new-expense__inputs'>
          <label htmlFor='title' className='title_label'>
            Title
          </label>
          <input
            type='text'
            name='title'
            id='title'
            value={newexpense.title}
            onChange={expenseChangeHandler}
          />
          <label htmlFor='amount'>Amount</label>
          <input
            type='number'
            name='amount'
            id='amount'
            min='0.01'
            step='0.01'
            value={newexpense.amount}
            onChange={expenseChangeHandler}
          />
          <ExpensesCategory
            categories={categories}
            onChangeCategory={onChangeCategoryHandler}
            slectedCategory={newexpense.category}
          />
          <label htmlFor='date'>Date</label>
          <input
            type='date'
            name='date'
            id='date'
            min={`${mindate}-01-01`}
            max={maxdate}
            value={newexpense.date}
            onChange={expenseChangeHandler}
          />
          <div className='sorting'>
            <Button
              type='button'
              className='sort-button'
              onClick={() => sortonClickHandler('up')}
            >
              &darr;
            </Button>
            <p>Sort</p>
            <Button
              type='button'
              className='sort-button'
              onClick={() => sortonClickHandler('down')}
            >
              &uarr;
            </Button>
          </div>
        </div>
        <div className='new-expense__controls'>
          <ExpensesFilter
            selected={selectedYear}
            onChangeFilter={filterChangeHandler}
            mindate={mindate}
          />
          <Button type='button' className='button' onClick={listOnClickHandler}>
            {list_button_value}
          </Button>
          <Button
            type='button'
            className='button'
            onClick={chartOnClickHandler}
          >
            Chart
          </Button>
          <Button type='submit' className='button'>
            Add
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ControlExpense;

/* if (window.confirm('Are you still sure?') === true) {
      restoreData();
      onError({
        title: 'Data restored successfully!',
        message: `Data restored successfully!
        you have to delete the file my-expenses.txt from your expenses app root folder, it is insecure to keep it there , any other click by mistake on the button Up Load will restore all the data which inside my-expenses again which maybe is old in that moment, please do not use Up Load button at all if you are not sure exactly what you are doing . if you need help please contact our customer support at : 015784446611`,
      });
    } else {
      onError({
        title: 'Restore action is Cancelled!',
        message:
          'Restore action is Cancelled!  if you need help please contact our customer support at : 015784446611',
      });
    } */
