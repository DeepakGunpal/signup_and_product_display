import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbars({ alert, setAlert, alertMsg }) {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert(false);
    };
    console.log(alertMsg.split(":")[0])
    return (
        <Stack spacing={1} sx={{ width: '50%' }}>
            <Snackbar open={alert} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={alertMsg.split(":")[0]} sx={{ width: '100%' }}>
                    {alertMsg}!
                </Alert>
            </Snackbar>
        </Stack>
    );
}
