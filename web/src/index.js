import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import 'fontsource-roboto';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

ReactDOM.render(
  <React.StrictMode>
    <div className="App">
      <Router history={createBrowserHistory()}>
        <App />
      </Router>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);
