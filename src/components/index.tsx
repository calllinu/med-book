/* eslint-disable global-require */
import React, { FC } from 'react';
import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom';

// components
import Layout from './app';
import Dashboard from './dashboard/dashboard';
import Profile from './profile/profile';
import Patients from './patients/patients';
import History from './history/history';

const AppComponents: FC = () => {
  return (
    <Router>
      <Layout>
        <Switch>
          <Redirect exact from="/" to="/dashboard" />
          <Route path="/profile" render={props => <Profile {...props} />} />
          <Route path="/dashboard" render={props => <Dashboard {...props} />} />
          <Route path="/patients" render={props => <Patients {...props} />} />
          <Route path="/history" render={props => <History {...props} />} />
        </Switch>
      </Layout>
    </Router>
  );
};

export default AppComponents;
