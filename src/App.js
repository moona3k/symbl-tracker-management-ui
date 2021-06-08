import React from 'react'
import { ThemeProvider } from "@material-ui/core/styles";
import { Route, Switch, Redirect } from "react-router-dom";

import TrackerManagement from './components/TrackerManagement'
import SignIn from './components/SignIn'
import AuthRoute from './AuthRoute'
import theme from './theme'

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Redirect to='/signin' />
      <Switch>
        <Route path='/signin'>
          <SignIn />
        </Route>
        <AuthRoute path='/trackers'>
          <TrackerManagement />
        </AuthRoute>
      </Switch>
    </ThemeProvider>
  )
}

export default App;
