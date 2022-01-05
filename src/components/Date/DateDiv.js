import React from 'react';
import Card from '../UI/Card';
import './DateDiv.css';
const DateDiv = ({ dateObj, onTryingToEdit }) => {
  const month = dateObj.toLocaleString('default', { month: 'short' });
  const year = dateObj.getFullYear();
  const day = dateObj.toLocaleString('default', { day: '2-digit' });
  return (
    <Card className='item-date' onTryingToEdit={onTryingToEdit}>
      <div className='item-date__month'>{month}</div>
      <div className='item-date__year'>{year}</div>
      <div className='item-date__day'>{day}</div>
    </Card>
  );
};
export default DateDiv;
