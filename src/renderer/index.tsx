import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

// Setup environmental variables
import * as dotenv from 'dotenv';
dotenv.config();

// Setup hot reloading
import './hmr';

// Import root container
import App from './containers/App';

// Import stateful components
import { store, history } from './store';

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
);
