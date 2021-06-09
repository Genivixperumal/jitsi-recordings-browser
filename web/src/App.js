import './App.css';

import { React, useEffect, useState } from 'react';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { ruRU } from '@material-ui/core/locale';

import TopAppBar from './components/TopAppBar';
import RecordingsScreen from './components/RecordingsScreen';
import { getUser, logOut } from './utils/API';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import About from './components/About';
import SignIn from './components/SignIn';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#1976d2' },
  },
}, ruRU);

function App() {
  const history = useHistory();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (location.pathname === '/about') return;
    getUser().then((res) => {
      setLoggedIn(true);
      if (res.data?.user) setUser(res.data.user);
      if (location.pathname !== '/list') {
        history.push('/list');
      }
    }).catch((e) => {
      if (loggedIn) setLoggedIn(false);
      if (location.pathname === '/list') {
        history.push('/login');
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const logout = (e) => {
    e.preventDefault();
    setLoggedIn(null);
    setError(null);
    logOut().then(() => {
      setLoggedIn(false);
      history.push('/login');
    }).catch((err) => {
      setError("Cannot log out: " + err.message);
      setLoggedIn(true);
    })
  };
  const login = (e) => {
    e.preventDefault();
    setLoggedIn(false);
    history.push('/login');
  }
  const about = (e) => {
    e.preventDefault();
    history.push('/about');
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <TopAppBar about={about} user={user} login={login} logout={logout} loggedIn={loggedIn}/>
        { error && <Alert severity="error" variant="filled">{error}</Alert> }
        <Switch>
          <Route path="/about" exact component={About} />
          <Route path="/list" exact component={RecordingsScreen} />
          <Route path="/login" exact component={SignIn} />
        </Switch>
      </ThemeProvider>
    </>
  );
}

export default App;
