import ReactDOM from 'react-dom';
import './index.css';
import ExpensesApp from './ExpensesApp';

ReactDOM.render(
  <ExpensesApp />,
  document.getElementById('root')
);


  /* function setState(newState) {
    Object.assign(state, newState);
    renderApp();
  }

  function renderApp() {
    ReactDOM.render(<App />, document.getElementById('root'));
  }

  renderApp(); */