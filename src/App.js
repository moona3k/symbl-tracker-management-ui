import React from 'react'
import { ThemeProvider } from "@material-ui/core/styles";
import { Route, Switch, Redirect } from "react-router-dom";

import TrackerManagement from './components/TrackerManagement'
import SignIn from './components/SignIn'
import AuthRoute from './AuthRoute'
import theme from './theme'

const App = () => {
  const isAuthenticated = !!window.localStorage.getItem(tokenKey)

  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route exact path='/'>
          {
            isAuthenticated
              ? <Redirect to='/trackers' />
              : <SignIn />
          }
        </Route>
        <AuthRoute path='/trackers'>
          <TrackerManagement />
        </AuthRoute>
      </Switch>
    </ThemeProvider>
  )
}

export default App;
