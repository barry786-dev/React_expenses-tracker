import React from 'react';
import './Button.css';
const Button = ({ onClick, children, className, type }) => {
  const classes = `general_button ${className}`;
  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
