import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import useFile from './store/useFile';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

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

const UploadFile = () => {
    const { uploadFile } = useFile();
    const onDrop = useCallback(acceptedFiles => {
        uploadFile(acceptedFiles[0]);
        console.log(acceptedFiles);
    }, []);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});
    
    return (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
           {
            isDragActive ?
              <p>Drop the files here ...</p> :
              <p>Drag 'n' drop some files here, or click to select files</p>
          }
        </div>
    )
}

const SubmitFile = withRouter(({history}) => {
    const { file, translateFile } = useFile();
    const attemptUpload = async () => {
        history.push('/results')
        translateFile();
    }
    const classes = useStyles();
    return (
        <Button
            onClick={attemptUpload}
            disabled={!file}
            className={file ? classes.button : classes.disabledButton}
        >
            Submit
        </Button>
    )
})

const SubmitPage = () => {
    const classes = useStyles();
    return (
        <Paper className={classes.root}>
            <UploadFile />
            <SubmitFile />
        </Paper>
    )
}

export default SubmitPage;