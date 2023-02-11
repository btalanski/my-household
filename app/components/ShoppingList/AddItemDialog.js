import * as React from 'react';
import { useMutation } from "react-query";
import { pb } from '@/utils/pocketbase';
import useLoggedUser from '@/hooks/useLoggedUser';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
  

export default function AddItemDialog(props) {
    const { open, handleClose } = props;    
    const user = useLoggedUser();
    const [openAlert, setOpenAlert] = React.useState(false);

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setOpenAlert(false);
    };

    const mutation = useMutation(async(data) => {
        return await pb.collection('shopping_list').create(data);
    }, {
        onSuccess: () => {
            handleClose();
        },
        onError: () => {
            setOpenAlert(true);
        }
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        if(!user.data){
            setOpenAlert(true);
            return;
        }

        const data = new FormData(event.currentTarget);

        const newEntry = {
            item: data.get('name'),
            quantity: data.get('quantity'),
            note: data.get('note') ?? '',
            added_by: user.data.id,
        };

        mutation.mutate(newEntry);
    };

    return (
    <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
    >
        <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
                Add item to list
            </Typography>
            <IconButton
                edge="end"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
            >
                <CloseIcon />
            </IconButton>
        </Toolbar>
        </AppBar>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt:6, m: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Item name"
              name="name"
              autoFocus
              variant="filled"
              helperText={"Example: Tomatoes, Milk, Cheese, etc"}
            />

            <TextField
              margin="normal"
              fullWidth
              id="quantity"
              label="Quantity"
              name="quantity"
              variant="filled"
              helperText={"Example: 1lb, 1L, 5"}
            />
            <Stack sx={{ width: '100%', mt: 2 }} spacing={2}>
              <LoadingButton
                loading={mutation.isLoading}
                loadingPosition="start"
                startIcon={<></>}
                variant="contained"
                type="submit"
                size="large"
              >
                <span>Add</span>
              </LoadingButton>
            </Stack>
        </Box>
        <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
            <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                Error completing request
            </Alert>
        </Snackbar>
    </Dialog>
    );
}