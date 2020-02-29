import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import './App.css';
import QuizScreen from './components/QuizScreen';
import WelcomeScreen from './components/WelcomeScreen';
import { ProtectedRoute } from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <React.Fragment>
        <Switch>
          <Route exact path='/' component={WelcomeScreen}></Route>
          <ProtectedRoute exact path='/quiz' component={QuizScreen}></ProtectedRoute>
          <Route path='/*' render={() => (<Redirect to='/' />)}></Route>
        </Switch>
    </React.Fragment>
  );
};

export default App;
