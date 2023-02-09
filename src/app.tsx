import React, { FC } from 'react';
import PrivateRoute from './private-route/private-route';
import Main from './components';
import store from './common/state/common/store';
import { IntlProvider, IntlActions } from 'react-redux-multilingual';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { localStorageTypes } from './common/constants/localstorage.constants';
import translations from './common/constants/translations';
import Login from './components/auth/login/login';
import ToastNotification from './common/components/toast-notification/toast-notification';
import Register from './components/auth/register/register';

const App: FC = () => {
  const language = localStorage.getItem(localStorageTypes.LANGUAGE);
  const locale = language ? language : 'ro';
  store.dispatch(IntlActions.setLocale(locale));

  return (
    <IntlProvider translations={translations} locale={locale}>
      <ToastNotification />
      <Router>
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <PrivateRoute path="/" component={Main} />
        </Switch>
      </Router>
    </IntlProvider>
  );
};

export default App;
