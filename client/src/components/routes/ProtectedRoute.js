import React from 'react';
import { Route, Redirect, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ component: Component, ...props }) => {
    const auth = useSelector(state => state.auth);

    return (
        <Route {...props}
            render={(props) => (
                auth.isLoggedIn 
                    ? <Component {...props} />
                    : <Redirect to='/login' />
            )}
        />
    )

};

export default ProtectedRoute;