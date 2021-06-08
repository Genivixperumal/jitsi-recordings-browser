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

const TopAppBar = ({login, logout, loggedIn, user}) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
          News
          </Typography> */}
          { loggedIn === null &&
            <CircularProgress />
          }
          { loggedIn === true && user &&
            <Button className={classes.menuButton} color="inherit" onClick={logout}>
              {labels.logout} <span className={classes.user}>{user}</span>
            </Button>
          }
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default TopAppBar;
