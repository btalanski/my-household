import * as React from 'react';
import { useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from "react-query";
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/router'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useAppContext } from '@/context/AppContext';
import LayoutUser from '@/components/LayoutUser';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import AddAction from '@/components/ShoppingList/AddAction';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { pb } from '@/utils/pocketbase';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

function ItemHeader(props) {
  const sx = {...{ fontSize: 18, fontWeight: 'bold', color: '#222'}, ...props?.isCrossed ? { textDecoration: 'line-through wavy red .15rem'} : {} };
  return (
    <>
      <Typography component="span" sx={sx}>{props.name}</Typography>
      {props.quantity && <Typography component="span" sx={{ fontSize: 15 }}> (qty {props.quantity})</Typography>}
    </>
  )
}

export default function Dashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { authUser, isLoggedIn, isLoadingApp, setIsLoadingApp } = useAppContext();
  const [checkedItems, setCheckedItems] = React.useState([]);
  const [crossedItems, setCrossedItems] = React.useState([]);
  const [subscribed, setSubscribed] = React.useState(false);
  
  const shoppingList = useQuery(["shoppingList"], async() => {
    const data = await pb.collection("shopping_list").getFullList(200, {
      expand: 'added_by',
      sort: "-created",
    });
    return data;
  });

  const crossCheckMutation = useMutation(async({id, isCrossed}) => {
    await pb.collection('shopping_list').update(id, { crossed: isCrossed });
});

  const handleCheckToggle = (value) => () => {
    console.log('handleCheckToggle');
    const currentIndex = checkedItems.indexOf(value);
    const newChecked = [...checkedItems];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedItems(newChecked);
  };

  const handleDelete = () => {
    console.log('handleDelete');

  };
  
  const handleCrossCheck = (value) => () => {
    const currentIndex = crossedItems.indexOf(value);
    const newCrossed = [...crossedItems];
    let isCrossed = true;

    if (currentIndex === -1) {
      newCrossed.push(value);
    } else {
      newCrossed.splice(currentIndex, 1);
      isCrossed = false;
    }
    setCrossedItems(newCrossed);
    crossCheckMutation.mutate({id: value, isCrossed});

  };

  useEffect(() => {
    if(!isLoadingApp && !isLoggedIn){
      router.push('/');
    }
  },[isLoadingApp, isLoggedIn]);

  useEffect(() => {
      if(crossedItems.length == 0 && shoppingList?.data?.length > 0){
        const ids = shoppingList.data.filter(({ crossed }) => crossed).map(({ id }) => id) || [];
        setCrossedItems(() => ids);
      }
  },[shoppingList.data, crossedItems]);

  useEffect(() => {
    return () => {
      if(subscribed){
        console.log('unsubscribing from shopping_list collection');
        pb.collection('shopping_list').unsubscribe().catch((err) => {console.log(err, err.originalError)});
      }
    }
  },[subscribed]);

  useEffect(() => {
    if(!isLoadingApp && isLoggedIn && !subscribed) {
      console.log('subscribing to shopping_list collection');
      pb.collection('shopping_list').subscribe('*', (event) => { 
        console.log('shopping_list collection refreshing...', event);
        queryClient.invalidateQueries(['shoppingList']);
      });
      setSubscribed(true);
    }
  },[isLoadingApp, isLoggedIn, subscribed]);

  if(isLoadingApp){
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
      <Box sx={{
        marginTop: 6,
        mb: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Typography variant="h4" component="h1" gutterBottom>Shopping list</Typography>
        {checkedItems.length > 0 && <Box>
          <Button variant="outlined" startIcon={<DeleteIcon />} onClick={handleDelete}>
            Delete selected
          </Button>
        </Box>}
        { shoppingList.isLoading && <Box sx={{ width: '100%', maxWidth: 580 }}>
          {[0,1,2,3,4,5].map((value) => (<Skeleton key={`sk_${value}`} variant="rectangular" animation="wave" height={56} sx={{ margin: 1}} />))}
        </Box>}
        <List sx={{ width: '100%', maxWidth: 580, bgcolor: 'background.paper' }}>
          {shoppingList.data?.map((record) => {
            const labelId = `checkbox-list-label-${record.id}`;
            const isCrossed = record.crossed || crossedItems.indexOf(record.id) !== -1;
            const primary = <ItemHeader name={record.item} quantity={record.quantity} isCrossed={isCrossed}></ItemHeader>;
            const secondary = `${record?.expand?.added_by?.name ? 'By ' + record?.expand?.added_by?.name + ' - ' : ''} ${formatDistanceToNow(new Date(record.created))} ago`;

            return (
              <ListItem 
                key={record.id}
                secondaryAction={
                  <>
                    <IconButton edge="end" aria-label="edit">
                      <ModeEditOutlineIcon />
                    </IconButton>
                  </>
                }
                disablePadding
                divider
              >
                <ListItemButton role={undefined}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checkedItems.indexOf(record.id) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                      onClick={handleCheckToggle(record.id)}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={primary} secondary={secondary} onClick={handleCrossCheck(record.id)}/>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <AddAction />
      </Box>
  );
}

Dashboard.getLayout = function getLayout(page) {
  return (
    <LayoutUser>{page}</LayoutUser>
  )
}