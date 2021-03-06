import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import OrderSteps from './containers/OrderSteps';
import Login from './forms/Login';
import Signup from './forms/Signup';
import Activate from './forms/Activate';
import DetailPage from './containers/DetailPage';
import ResetPassword from './forms/ResetPassword';
import ResetPasswordConfirm from './forms/ResetPasswordConfirm';

import Profile from './containers/Profile';
import PageNotFound from './components/PageNotFound';
import { Provider } from 'react-redux';
import store from './store';

import Layout from './hocs/Layout';

const App = () => (
  <Provider store={store}>
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/reset_password" component={ResetPassword} />
          <Route
            exact
            path="/password/reset/confirm/:uid/:token"
            component={ResetPasswordConfirm}
          />
          <Route exact path="/activate/:uid/:token" component={Activate} />
          <Route exact path="/detail/:itemId" component={DetailPage} />
          <Route exact path="/profile/:tab" component={Profile} />
          <Route exact path="/cart" component={OrderSteps} />
          <Route exact path="*" component={PageNotFound} />
        </Switch>
      </Layout>
    </Router>
  </Provider>
);

export default App;
