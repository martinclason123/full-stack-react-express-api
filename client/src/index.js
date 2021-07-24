import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from './Context/index';
import App from './App';
import './styles/index.css';
import './styles/global.css';


ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root')
);


