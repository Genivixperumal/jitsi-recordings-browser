import * as React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import { authorize } from '../utils/API';
import labels from '../labels';
import { Alert } from '@material-ui/lab';
import { Paper } from '@material-ui/core';

export default function SignIn({history}) {
  const [error, setError] = React.useState(null);

  const submit = (e) => {
    e.preventDefault();
    authorize(
      e.target.elements.username.value, e.target.elements.password.value
    ).then(res => {
      setError(null);
      if (res?.data?.authorized) {
        history.push('/list');
      }
    }).catch(err => {
      const error = err?.response?.data?.error;
      setError(error ? error : "Error");
    });
  };

  return (
    <Container className="vcenter" component="main" maxWidth="sm">
      <Paper
        variant="outlined"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        className="padded marged"
      >
        <Typography component="h1" variant="h5">
          {labels.login}
        </Typography>
        <Box
          component="form"
          onSubmit={submit}
          noValidate
          sx={{
            width: '100%', // Fix IE11 issue.
            mt: 1,
          }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label={labels.username}
            name="username"
            autoComplete="null"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label={labels.passwd}
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {labels.signin}
          </Button>
          { error && <Alert severity="error" variant="standard">{error}</Alert> }
        </Box>
      </Paper>
    </Container>
  );
}
