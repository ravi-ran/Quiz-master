import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import Auth from '../services/AuthService';

export const ProtectedRoute: React.FC<RouteProps> = ({ component: Component, ...rest }) => {
    if (!Component) return null;
    return (
        <Route
            {...rest} 
            render={
                props => {
                    if(Auth.isAuthenticated()) {
                        return < Component {...props} />
                    } else {
                        return <Redirect to  = {'/'}></Redirect>
                    }
                }
            }></Route>
    )
}