import * as React from 'react';
import { pb } from '@/utils/pocketbase';
import { useQuery, useQueryClient, useMutation } from "react-query";
import useLoggedUser from '@/hooks/useLoggedUser';
import Box from '@mui/material/Box';
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
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const getShoppingListItem = async(recordId) => {
    const data = await pb.collection("shopping_list").getOne(recordId, {
      expand: 'added_by',
    });
    return data;
  }

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
  
const defaultAlertState = { isOpen: false, isError: false, msg: ''};

export default function EditItemDialog(props) {
    const { itemId, handleClose } = props;    
    const user = useLoggedUser();
    const item = useQuery(["shoppingList", itemId], () => getShoppingListItem(itemId));
    const [alertState, setAlertState] = React.useState(defaultAlertState);

    const mutation = useMutation(async(data) => {
        // return await pb.collection('shopping_list').create(data);
    }, {
        onSuccess: () => {
            setAlertState({ isOpen: true, isError: false, msg: 'Updated successfully.'});
        },
        onError: () => {
            setAlertState({ isOpen: true, isError: true, msg: 'An error ocurred. Please try again in a moment.'});
        }
    });
    
    const handleSubmit = (event) => {
        event.preventDefault();

        if(!user.data){
            setAlertState({ isOpen: true, isError: true, msg: 'An error ocurred. Please try again in a moment.'});
            return;
        }

        return;
    };

    const handleCloseAlert = (_, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertState(defaultAlertState);
    };

    if(item.isLoading){
        return(
            <div>
                <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={true}
                transitionDuration={0}
                >
                <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        )
    }

    return (
    <Dialog
        fullScreen
        open={true}
        onClose={handleClose}
        TransitionComponent={Transition}
    >
        <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
                Edit list item
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
                <span>Save</span>
              </LoadingButton>
            </Stack>
        </Box>
        <Snackbar open={alertState.isOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
            <Alert onClose={handleCloseAlert} severity={alertState.isError ? 'error' : 'success'} sx={{ width: '100%' }}>
                {alertState.msg}
            </Alert>
        </Snackbar>
    </Dialog>
    );
}