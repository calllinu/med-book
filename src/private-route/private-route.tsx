import React, { FC } from 'react';
import { connect, RootStateOrAny } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { auth } from '../firebase-config';
import { IPrivateRouteProps } from './private-route.types';

const PrivateRoute: FC<IPrivateRouteProps> = ({ component: Component, ...props }) => {
  return (
    <Route
      {...props}
      render={propsFromRender =>
        auth.currentUser ? (
          <Component {...propsFromRender} />
        ) : (
          <Redirect
            to={{
              pathname: `/login`,
              state: { from: propsFromRender.location },
            }}
          />
        )
      }
    />
  );
};

const mapStateToProps = (): RootStateOrAny => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);
