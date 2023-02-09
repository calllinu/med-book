import { encryptTransform } from 'redux-persist-transform-encrypt';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import { persistReducer } from 'redux-persist';
import thunkMiddleware from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import reducers from './index.reducers';

const trKey = 'key';

/* istanbul ignore next */
const persistedReducer = persistReducer(
  {
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['toastNotification'],
    transforms: [
      encryptTransform({
        secretKey: trKey,
        onError: function () {
          console.log('Error encrypting state');
        },
      }),
    ],
  },
  reducers
);

const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunkMiddleware)));

export default store;
