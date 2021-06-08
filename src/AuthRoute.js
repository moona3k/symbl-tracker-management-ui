import React from "react";
import { Redirect, Route } from "react-router-dom";
import { tokenKey } from './config'

const AuthRoute = ({ children, ...rest }) => {
    const isAuthenticated = !!window.localStorage.getItem(tokenKey) // isAuthenticated will be updated run whenever AuthRoute is hit

    return (
        <Route {...rest} render={() => {
            return isAuthenticated
                ? children
                : <Redirect to='/signin' />
        }} />
    );
};

export default AuthRoute;
