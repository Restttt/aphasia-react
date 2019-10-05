import React, { useState } from 'react';
import { withProvider } from './store/Context';
import { makeStyles } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';
import useLogin from './store/useLogin';
import get from 'lodash/get';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
      height: '20em',
      width: '50%',
      margin: '10em auto',
      padding: '4em 0',
  
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      flexDirection: 'column',
    },
    button: {
      backgroundColor: '#002e5d',
      color: 'white',
    }
  })

const LoginFields = withRouter(({ history }) => {
    const [user, setUser] = useState({
        username: '',
        password: '',
    });

    const update = (name, value) => {
        setUser({
            ...user,
            [name]: value
        });
    };

    const attemptLogin = async () => {
        const loggedIn = await login(user);
        console.log(loggedIn);
        if (loggedIn) {
            history.push('/submit');
        }
    }

    const { error, login } = useLogin();
    const classes = useStyles();

    return(
        <>
            <TextField
                name="username"
                label="Username"
                onChange={e => update(e.target.name, get(e.target, 'value', ''))}
                value={user.username || ''}
                variant="outlined"
                error={error}
                helperText={error}
            />
            <TextField
                name="password"
                label="Password"
                onChange={e => update(e.target.name, get(e.target, 'value', ''))}
                value={user.password || ''}
                type="password"
                variant="outlined"
            />
            <Button
                onClick={attemptLogin}
                className={classes.button}
            >
            Login
            </Button>
        </>
    )
})

const LoginPage = () => {
    const classes = useStyles();
    return (
        <Paper className={classes.root}>
            <Typography variant="h5">
                Aphasia Speech To Text
            </Typography>
            <LoginFields />
        </Paper>
    )
}

export default LoginPage;