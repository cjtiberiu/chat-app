import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Chat from './components/chat/Chat';
import ProtectedRoute from './components/routes/ProtectedRoute';

import { library } from '@fortawesome/fontawesome-svg-core';

import { faCaretDown, faSignOutAlt, faSmile, faImage, faSpinner, faEllipsisV, faUserPlus, faTrash, faUpload, faTimes, faBell } from '@fortawesome/free-solid-svg-icons';
library.add(faCaretDown, faSignOutAlt, faSmile, faImage, faSpinner, faEllipsisV, faUserPlus, faTrash, faUpload, faTimes, faBell);

const Home = () => {

  return (
    <div>Home component</div>
  )
}

const App = () => {

  return (
    <div className="App">
      <Router>

        <Switch>
          <Route exact path='/' component={Login} />
          <ProtectedRoute path='/chat' component={Chat} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/register' component={Register} />
        
          <Route render={() => <h1>404 Page not found</h1>} />
        </Switch>
        
      </Router>
      
    </div>
  );
}

export default App;
