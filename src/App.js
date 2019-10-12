import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { withProvider } from './store/Context';
import useLogin from './store/useLogin';

import Login from './Login';
import SubmitPage from './SubmitPage';
import ResultPage from './ResultPage';

const App = () => {

  const { loggedIn } = useLogin();

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/submit">
          {!loggedIn ? <Redirect to="/" /> : <SubmitPage />}
        </Route>
        <Route path="/results">
          {!loggedIn ? <Redirect to="/" /> : <ResultPage />}
        </Route>
        <Route path="/">
          <Login />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default withProvider(App);
