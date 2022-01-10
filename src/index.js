import ReactDOM from 'react-dom';
import './index.css';
import ExpensesApp from './ExpensesApp';

ReactDOM.render(
  <ExpensesApp />,
  document.getElementById('root')
);

//The Object.assign() method copies all enumerable own properties from one or more source objects to a target object. It returns the modified target object.

  /* function setState(newState) {
    Object.assign(state, newState);
    renderApp();
  }

  function renderApp() {
    ReactDOM.render(<App />, document.getElementById('root'));
  }

  renderApp(); */