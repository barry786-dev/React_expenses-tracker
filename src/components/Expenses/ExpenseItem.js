import React, { useRef, useState } from 'react';
import './ExpenseItem.css';
import DateDiv from '../Date/DateDiv';
import Button from '../UI/Button';
// global variabels will containes the preveious values inside the current expense so i can retrive them if something went wrong with the user and he cancel the editing after he has aready over write the values
let prevTitle;
let prevAmount;
let prevCategory;
const ExpenseItem = ({
  expense,
  editExpense, //prop will triger editExpenseHandler() inside ExpensesAppjs
  deleteExpense,
  onError,
  currency,
  categories,
}) => {
  const [editable, setEditable] = useState(false); // state will effect the contentEditable attribute in some of our html elements below
  const [editTitle, setEditTitle] = useState('Edit'); // state to toggle the title of edit button so it can function difrently according to its title (either save the changes(if the title is Done)or start allow editing ifthe title is (Edit))
  const [node, setNode] = useState(''); // will add string value ('h2' or 'span'  or 'div') to know to which element tag i need to send the focus and highlighting.
  const myTitle = useRef(null);
  const myAmount = useRef(null);
  const myCatogery = useRef(null);
  // collect the elements which we are going to edit its values (title, amount, category)
  const titleNode = myTitle.current;
  const amountNode = myAmount.current;
  const catogeryNode = myCatogery.current;
  //this is statment will check which node we are standing on it to return the foucs to it and highlight it if we try to leave it with wrong value
  if (editable) {
    if (node === 'h2') {
      titleNode.focus();
      highlight(titleNode);
    } else if (node === 'span') {
      amountNode.focus();
      highlight(amountNode);
    } else if (node === 'div') {
      catogeryNode.focus();
      highlight(catogeryNode);
    }
  }

  const EditclickHandler = () => {
    if (editTitle === 'Edit') {
      setEditable(() => true);
      setEditTitle(() => 'Done');
      setNode('h2');
      prevTitle = myTitle.current.innerText;
      prevAmount = myAmount.current.innerText;
      prevCategory = myCatogery.current.innerText;
    } else if (editTitle === 'Done') {
      const newTitle = titleNode.innerText.trim();
      const newAmount = amountNode.innerText;
      const newCategory = catogeryNode.innerText;
      if (newTitle === '') {
        onError({
          title: 'title is wrong',
          message: 'you can not asign empty title',
        });
        titleNode.focus();
      } else if (
        +newAmount === 0 ||
        isNaN(newAmount) ||
        /\s/g.test(newAmount) // newAmount.indexOf(' ') >= 0;
      ) {
        /* alert(
          'the amount is empty or the value is wrong or there is spaces , enter only number please without any spaces or letters'
        ); */
        onError({
          title: 'Amount is wrong',
          message: `the amount value (${newAmount}) is wrong or the value is empty or there is spaces , enter only number please without any spaces or letters`,
          // node: tryToFous,
        });
        /* function tryToFous() {
          amountNode.focus();
          highlight(amountNode);
        } */
        setNode('span');
        /* amountNode.focus();
        highlight(amountNode); */
      } else if (categories.indexOf(newCategory) < 0) {
        onError({
          title: 'category is wrong',
          message: `This category : ${newCategory} is not exist in your catogry options, if you like to edit category of an expense with catogry whch you do not add it before then you need first to go to the sittings and add his new catogry, and then edit your expense according to it, please cancel the edit mood by press X button on your expense line and go to the sittings to add your new category and then come back to your expense to edit it`,
        });
        setNode('div');
      } else {
        setEditTitle(() => 'Edit');
        setEditable(() => false);
        editExpense(newTitle, newAmount, newCategory, expense.id); //editExpense is a prop
      }
    }
  };

  const dateEditingHandler = () => {
    if (editTitle === 'Done') {
      onError({
        title: 'Date is unable to edit here',
        message:
          'you can not change the date, you can change only the title or/and the amount if you atten to change the date you need to delete the expense and enter new one',
      });
      titleNode.focus();
    }
  };
  const deleteExpenseHandler = () => {
    const modalDataDeleted = () => {
      onError({
        title: 'Data deleted successfully!',
        message: `Data deleted successfully!
        Title : ${expense.title}
        Amount : ${expense.amount}$
        Date : ${expense.date}`,
      });
    };
    const modalDataDeleteCancel = () => {
      onError({
        title: 'Delete action is Cancelled!',
        message: 'Delete action is Cancelled!',
      });
    };
    if (editTitle === 'Done') {
      setEditTitle('Edit');
      setEditable(false);
      myAmount.current.innerText = prevAmount;
      myTitle.current.innerText = prevTitle;
      myCatogery.current.innerText = prevCategory;
    } else if (editTitle === 'Edit') {
      onError({
        title: 'Attention , Delete Action',
        message: 'Are you sure you want to delete completly this expense?',
        confirmForm: true,
        ExcuteAction: () => deleteExpense(expense.id),
        afterExcuteAction: modalDataDeleted,
        cancelExcuteAction: modalDataDeleteCancel,
      });
    }
  };
  return (
    <li id='expense_list'>
      <div id='category_div'>
        <div
          className='category_innerdiv'
          contentEditable={editable}
          ref={myCatogery}
        >
          {expense.category || 'No category'}
        </div>
      </div>
      <div className='expense-item'>
        <DateDiv
          dateObj={new Date(expense.date)}
          onTryingToEdit={dateEditingHandler}
        />
        <div className='expense-item__description'>
          <h2 contentEditable={editable} ref={myTitle}>
            {expense.title}
          </h2>
          <div className='expense-item__amount'>
            <span contentEditable={editable} ref={myAmount}>
              {expense.amount}
            </span>
            <span contentEditable='false'>{currency}</span>
          </div>
        </div>
        <Button onClick={EditclickHandler} className='expense_button'>
          {editTitle}
        </Button>
        <div id='delete_expense_wrapper'>
          <div
            className='close_it delete_expense'
            onClick={deleteExpenseHandler}
          ></div>
        </div>
      </div>
    </li>
  );
};

export default ExpenseItem;

//<p contentEditable='false'>$</p>;
const highlight = (node) => {
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
};

/* let titleNode;
  let amountNode;
  useEffect(() => {
    titleNode = myTitle.current.firstChild;
    amountNode = titleNode.nextSibling.firstChild;
    if (editable) {
      titleNode.focus();
      highlight(titleNode);
    }
  }, [editable]); */

/* else if (
      window.confirm(
        'Are you sure you want to delete completly this expense?'
      ) === true
    ) {
      deleteExpense(expense.id);
      onError({
        title: 'Data deleted successfully!',
        message: `Data deleted successfully!
        Title : ${expense.title}
        Amount : ${expense.amount}$
        Date : ${expense.date}`,
      });
    } else {
      onError({
        title: 'Delete action is Cancelled!',
        message: 'Delete action is Cancelled!',
      });
    } */
