import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';
import useFile from './store/useFile';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
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
    },
    disabledButton: {
      backgroundColor: 'grey',
      color: 'white',
    }
  })

const Loading = () => (
    <CircularProgress color="primary" />
)

const DisplayResponse = () => {
    const { response } = useFile();
    return (
        <Typography variant="body2">
            {response}
        </Typography>
    )
}

const ClearButton = withRouter(({ history }) => {
    const { clearFile } = useFile();
    const classes = useStyles();

    const resetFile = () => {
        clearFile();
        history.push('/submit');
    }

    return (
        <Button
            onClick={resetFile}
            className={classes.button}
        >
            Clear
        </Button>
    )
})

const ResultPage = () => {
    const { loading } = useFile();
    const classes = useStyles();
    return (
        <>
        <Paper className={classes.root}>
            {loading 
                ? <Loading />
                : <DisplayResponse />}
        </Paper>
        <ClearButton />
        </>
    )
}


export default ResultPage;