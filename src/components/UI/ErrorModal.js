import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import Card from './Card';
import Button from './Button';
import './ErrorModal.css';
const Backdrop = (props) => {
  return <div className='backdrop' onClick={props.onConfirm}></div>;
};
const ModalOverlay = (props) => {
  return (
    <Card className='modal'>
      <header className='header'>
        <h2>{props.title}</h2>
      </header>
      <div className='content'>
        <p>
          {props.message}
          {props.message2}
        </p>
      </div>
      <footer className='actions'>
        {props.confirmForm && (
          <Button
            onClick={() => {
              props.onClick();
              //props.onConfirm();
              props.afterExcuteAction();
            }}
          >
            Confirm
          </Button>
        )}
        {props.confirmForm && (
          <Button onClick={props.cancelExcuteAction}>Cancel</Button>
        )}
        {!props.confirmForm && <Button onClick={props.onConfirm}>Okay</Button>}
      </footer>
    </Card>
  );
};
//Portals are a way to render React children outside the main DOM hierarchy of the parent component without losing the react context.
//A typical use case for portals is when a parent component has an overflow: hidden or z-index style, but you need the child to visually "break out" of its container. For example, dialogs, hovercards, and tooltip.
//https://reactjs.org/docs/portals.html
const ErrorModal = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Backdrop onConfirm={props.onConfirm} />,
        document.getElementById('backdrop-root')
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          onClick={props.onConfirmClick}
          afterExcuteAction={props.afterExcuteAction}
          cancelExcuteAction={props.cancelExcuteAction}
          confirmForm={props.confirmForm}
          title={props.title}
          message={props.message}
          message2={props.message2}
          onConfirm={props.onConfirm}
        />,
        document.getElementById('overlay-root')
      )}
    </Fragment>
  );
};

export default ErrorModal;
