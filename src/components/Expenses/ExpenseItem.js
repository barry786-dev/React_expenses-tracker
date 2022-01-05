import React, { useRef, useState } from 'react';
import './ExpenseItem.css';
import DateDiv from '../Date/DateDiv';
import Button from '../UI/Button';
let prevTitle;
let prevAmount;
const ExpenseItem = ({
  expense,
  editExpense,
  deleteExpense,
  onError,
  currency,
}) => {
  const [editable, setEditable] = useState(false);
  const [editTitle, setEditTitle] = useState('Edit');
  const [node, setNode] = useState('');
  const myTitle = useRef(null);
  const myAmount = useRef(null);

  const titleNode = myTitle.current;
  const amountNode = myAmount.current;
  if (editable) {
    if (node === 'h2') {
      titleNode.focus();
      highlight(titleNode);
    } else if (node === 'span') {
      amountNode.focus();
      highlight(amountNode);
    }
    /* titleNode.focus();
    highlight(titleNode); */
    /* amountNode.focus();
    highlight(amountNode); */
  }

  const EditclickHandler = () => {
    if (editTitle === 'Edit') {
      setEditable(() => true);
      setEditTitle(() => 'Done');
      setNode('h2');
      prevTitle = myTitle.current.innerText;
      prevAmount = myAmount.current.innerText;
    } else if (editTitle === 'Done') {
      const newTitle = titleNode.innerText.trim();
      const newAmount = amountNode.innerText;
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
      } else {
        setEditTitle(() => 'Edit');
        setEditable(() => false);
        editExpense(newTitle, newAmount, expense.id); //editExpense is a prop
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
    const modalDataDeleted=()=>{
      onError({
        title: 'Data deleted successfully!',
        message: `Data deleted successfully!
        Title : ${expense.title}
        Amount : ${expense.amount}$
        Date : ${expense.date}`,
      });
    }
    const modalDataDeleteCancel=()=>{
      onError({
        title: 'Delete action is Cancelled!',
        message: 'Delete action is Cancelled!',
      });
    }
    if (editTitle === 'Done') {
      setEditTitle('Edit');
      setEditable(false);
      myAmount.current.innerText = prevAmount;
      myTitle.current.innerText = prevTitle;
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
    <li className='expense-item'>
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
      <Button onClick={EditclickHandler}>{editTitle}</Button>
      <div id='delete_expense_wrapper'>
        <div
          className='close_it delete_expense'
          onClick={deleteExpenseHandler}
        ></div>
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