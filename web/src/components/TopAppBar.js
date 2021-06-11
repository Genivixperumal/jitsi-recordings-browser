import { AppBar, Toolbar, Button, CircularProgress, makeStyles } from '@material-ui/core';
import labels from '../labels';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: "auto",
    marginRight: theme.spacing(2),
  },
  user: {
    marginLeft: theme.spacing(0.5),
    textTransform: 'uppercase',
  },
  title: {
    flexGrow: 1,
  },
}));

const TopAppBar = ({login, logout, loggedIn, user, about}) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Button edge="start"
            color="inherit" onClick={about}>
              {labels.about}
          </Button>
          { loggedIn === null &&
            <CircularProgress />
          }
          { loggedIn === true && user &&
            <Button className={classes.menuButton} color="inherit" onClick={logout}>
              {labels.logout} <span className={classes.user}>{user}</span>
            </Button>
          }
          { loggedIn === false &&
            <Button className={classes.menuButton} color="inherit" onClick={login}>
              {labels.signin}
            </Button>
          }
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default TopAppBar;
