import App from './app';
import React, { Component, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import store from './common/state/common/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

const persistor = persistStore(store);
class Root extends Component {
  render(): ReactNode {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('root'));
