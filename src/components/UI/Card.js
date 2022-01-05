import React from 'react';
import './Card.css';
const Card = ({ className, children, onTryingToEdit }) => {
  const classes = `card ${className}`;
  //onTryingToEdit props will excute dateEditingHandler() in Expenseitem.js
  return (
    <div className={classes} onClick={onTryingToEdit}>
      {children}
    </div>
  );
};
export default Card;
