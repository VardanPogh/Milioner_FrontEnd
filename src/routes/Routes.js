import React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import Dashboard from "../components/Dashboard";

function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" component={Dashboard} />
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;
