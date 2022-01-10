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
  settingsValues, //is array has the started year and the used currency
  hideShowChart,
  hideControls,
  hideShowList,
  sortExpensesByDate,
  onError,
  onSettingSubmit, //function will add the new sitings of user currency and starting year
  downloadExpensesFile,
  restoreData,
  onNewCategoryAdd,
  categories,
}) => {
  /* ****************************** */
  /* ****************************** */
  const filterChangeHandler = (selectedYear) => {
    onFilter([selectedYear, null]); //onFilter is a prop will triger FilterHandler() in ExpensesApp.js
  };
  /* ****************************** */
  /* ****************************** */
  const [newexpense, setNewexpense] = useState({}); // a state to save any new expense entired by the form
  const expenseChangeHandler = (e) => {
    //this function will gather the data when any new data expense start to be entierd by the user, it will creat object which include this data and safe it in the state (newexpense), will not check if it is valid
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
      return { ...prev, id: Date.now().toString() }; // here I produce id to each expense the user must be quic like a super-machine to duplicate this id;
    });
  };
  /* ****************************** */
  // here i add it later to collect the category choos of user when add new expense
  //onChangeCategoryHandler will work as option to add category to new expense or as filter to filter exist expenses according to category
  const onChangeCategoryHandler = (category) => {
    setNewexpense((prev) => {
      return { ...prev, category: category };
    });
    category_to_add = category; // I think i have to delete this line i do not remember why i even used it
    onFilter([null, category]);
  };
  /* ****************************** */
  const passNewExpenseHandler = (e) => {
    //this function will check if the newexpense state has proper new expense without any mistakes from the user, then pass this new expense to onSubmit as parameter, finally will reset the state of newexpense to empty the field of the user form.
    e.preventDefault();
    const checkvalidty = ['title', 'amount', 'id', 'date'];
    //The every() method tests whether all elements in the array pass the test implemented by the provided function. It returns a Boolean value.
    if (checkvalidty.every((item) => newexpense.hasOwnProperty(item))) {
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
  /* ****************************** */
  /* ****************************** */
  const listOnClickHandler = () => {
    if (list_button_value === 'Hide-List') {
      list_button_value = 'Show-List';
    } else {
      list_button_value = 'Hide-List';
    }
    hideShowList(); //becuase of rendereing i could use global variable to change the button label
  };
  /* ****************************** */
  /* ****************************** */
  const sortonClickHandler = (sort_direction) => {
    sortExpensesByDate(sort_direction); // i will pass through call back funcion 'up' or 'down'
  };
  /* ****************************** */
  //willshow or hide the settigs panel
  const [settings, setSettings] = useState(false);
  const settingsIconOnClickHandler = () => {
    setSettings(!settings);
  };
  /* ****************************** */
  // settingSaveSubmitHandler will be triggred when the user submit new currency or choose starting year
  const settingSaveSubmitHandler = (e) => {
    e.preventDefault();
    onSettingSubmit([e.target.year.value, e.target.currency.value]);
  };
  /* ****************************** */
  /* ****************************** */
  //addCategoryClickHandler will add new category in the settings panel f the user add new one.
  const myCategoryInput = useRef(null);
  const addCategoryClickHandler = () => {
    //categoryArr.push(myCategoryInput.current.value);
    onNewCategoryAdd(myCategoryInput.current.value);
    myCategoryInput.current.value = '';
  };
  /* ****************************** */
  /* ****************************** */
  const downloadExpensesonClickHandler = () => {
    downloadExpensesFile();
    onError({
      title: 'Data is downloaded',
      message:
        'your expenses are downloaded to your default browser download folder, the file name is my-expenses.txt, please we recomend you strongly to move the file to other folder where you can keep it safe, if you lost your expenses information for any reason or if you want to use the expenses app on other machine, and you want to start to get all the expenses back again, then follow these steps exactly: 1- copy my-expenses.txt to your expenses app root folder 2- start the expenses App 3- go to settings 4- press Up Load button. and you will get all the data from my-expenses.txt back. please after you restore your data , you have to delete the file my-expenses.txt from your expenses app root folder, it is insecure to keep it there after restoring your data, if you are not sure about how to restore your data exactly and you need help please contact our customer support at : 015784446611 or Email:',
      message2: <a href='mailto:mbrsyr@yahoo.com'>mbrysr@yahoo.com</a>,
    });
  };
  /* ****************************** */
  /* ****************************** */
  const modalDataRestored = () => {
    //will show meesage to the user if his data restored successfully, i need to add some work later for the real errors
    onError({
      title: 'Data restored successfully!',
      message: `Data restored successfully!
        you have to delete the file my-expenses.txt from your expenses app root folder, it is insecure to keep it there , any other click by mistake on the button Up Load will restore all the data which inside my-expenses again which maybe is old in that moment, please do not use Up Load button at all if you are not sure exactly what you are doing . if you need help please contact our customer support at : 015784446611 or Email:`,
      message2: <a href='mailto:mbrsyr@yahoo.com'>mbrysr@yahoo.com</a>,
    });
  };
  /* ****************************** */
  /* ****************************** */
  const modalDataRestoredCancel = () => {
    onError({
      title: 'Restore action is Cancelled!',
      message:
        'Restore action is Cancelled!  if you need help please contact our customer support at : 015784446611 or Email:',
      message2: <a href='mailto:mbrsyr@yahoo.com'>mbrysr@yahoo.com</a>,
    });
  };
  /* ****************************** */
  /* ****************************** */
  const uploadExpensesonClickHandler = () => {
    //nice exapmle about my error component object
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
  /* ****************************** */
  /* ****************************** */
  //this is pure js to take some dates values to use them in our App
  const date = new Date();
  const maxdate = date.toISOString().substring(0, 10); //to use it to be updae daily with new date
  const maxyear = date.toISOString().substring(0, 4);
  const mindate = +settingsValues[0]; // it will be used to be inside filtered year options, it comes orgenely by user choice in the settings
  return (
    <Card className='new-expense'>
      {settings && (
        <Card>
          <form
            className='new-expense__sittings-form'
            onSubmit={settingSaveSubmitHandler}
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
                defaultValue={settingsValues[0]}
              />
              <label htmlFor='currency'>currency</label>
              <select
                name='currency'
                id='currency'
                className='sitting-year__select'
                defaultValue={settingsValues[1]}
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
        onClick={settingsIconOnClickHandler}
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
            selected={selectedYear} //this maybe look like endless loop but it is not tue
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
