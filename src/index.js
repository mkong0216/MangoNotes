import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker';

import 'semantic-ui-css/semantic.min.css';
import './css/index.css';

import App from './components/App';
import store from './store'
// TODO - move to initialize function
import { createUserSignInData } from './store/actions/user'

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

if (window.localStorage.signedInUser) {
  store.dispatch(createUserSignInData(window.localStorage.signedInUser))
}
