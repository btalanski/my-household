import * as React from 'react';
import { useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from "react-query";
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/router'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import useLoggedUser from '@/hooks/useLoggedUser';
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
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import BottomNav from '@/components/BottomNav';
import SkeletonList from '@/components/ShoppingList/SkeletonList';
import DeleteItemsBar from '@/components/ShoppingList/DeleteItemsBar';

function ItemHeader(props) {
  const sx = {...{ fontSize: 18, fontWeight: 'bold', color: '#222'}, ...props?.isCrossed ? { textDecoration: 'line-through wavy red', textDecorationThickness: '.15rem' } : {} };
  return (
    <>
      <Typography component="span" sx={sx}>{props.name}</Typography>
      {props.quantity && <Typography component="span" sx={{ fontSize: 15 }}> (qty {props.quantity})</Typography>}
    </>
  )
}

const getShoppingList = async() => {
  const data = await pb.collection("shopping_list").getFullList(200, {
    expand: 'added_by',
    sort: "-created",
  });
  return data;
}

const crossCheckItem = async({id, isCrossed}) => {
  await pb.collection('shopping_list').update(id, { crossed: isCrossed });
}

const deleteItem = async({id}) => {
  await pb.collection('shopping_list').delete(id);
}

export default function Dashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useLoggedUser();
  const [checkedItems, setCheckedItems] = React.useState([]);
  const [crossedItems, setCrossedItems] = React.useState([]);
  const [deletedItems, setDeletedItems] = React.useState([]);
  const [subscribed, setSubscribed] = React.useState(false);
  const shoppingList = useQuery(["shoppingList"], getShoppingList);
  const crossCheckMutation = useMutation(crossCheckItem);
  const deleteMutation = useMutation(deleteItem);

  const handleCheckToggle = (value) => () => {
    setCheckedItems((prevState) => {
      if (prevState.indexOf(value) === -1) {
        return [...prevState, value];
      }
      return prevState.filter((item) => item !== value);
    })
  };

  const handleDelete = () => {
    setCheckedItems([]);
    setDeletedItems(checkedItems);
  };
  
  const handleCrossCheck = (value) => () => {
    let newCrossed;
    let isCrossed = true;

    if (crossedItems.indexOf(value) === -1) {
      newCrossed = [...crossedItems, value];
    } else {
      newCrossed = crossedItems.filter((item) => item !== value);
      isCrossed = false;
    }

    setCrossedItems(newCrossed);
    crossCheckMutation.mutate({ id: value, isCrossed });
  };

  useEffect(() => {
    if(!user.isLoading && !user.data){
      router.push('/');
    }
  },[user.isLoading, user.data]);

  // Update state with crossed items ids from db
  useEffect(() => {
      if(shoppingList.data?.length > 0){
        const ids = shoppingList.data.filter(({ crossed }) => crossed).map(({ id }) => id);
        if(ids.length > 0) setCrossedItems(() => ids);
      }
  },[shoppingList.data]);

  // Cancel active subscription to collection
  useEffect(() => {
    return () => {
      if(subscribed){
        console.log('unsubscribing from shopping_list collection');
        pb.collection('shopping_list').unsubscribe().catch((err) => {console.log(err, err.originalError)});
      }
    }
  },[subscribed]);

  // Subscribe for realtime updates from collection
  useEffect(() => {
    if(user.data && !subscribed) {
      console.log('subscribing to shopping_list collection');
      pb.collection('shopping_list').subscribe('*', (event) => { 
        console.log('shopping_list collection refreshing...', event);
        queryClient.invalidateQueries(['shoppingList']);
      });
      setSubscribed(true);
    }
  },[user.data, subscribed]);

  // Delete selected items from db
  useEffect(() => {
    if(deletedItems.length > 0) {
      console.log('delete');
      for(let i = 0; i < deletedItems.length; i++){
        deleteMutation.mutate({ id: deletedItems[i] });
      }
    }
  },[deletedItems]);

  if(user.isLoading){
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
      <>
      <Box sx={{ flexGrow: 1, display: 'flex' }}>
        <AppBar component="nav">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Shopping List
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      {checkedItems.length > 0 && <DeleteItemsBar selectedItems={checkedItems} deleteCallback={handleDelete}></DeleteItemsBar>}
      <Box component="main" sx={{
        marginTop: 10,
        mb: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {shoppingList.isLoading && <SkeletonList />}
        <List sx={{ width: '100%', maxWidth: 580, bgcolor: 'background.paper' }}>
          {shoppingList.data?.filter(({id}) => deletedItems.indexOf(id) === -1).map((record) => {
            const labelId = `checkbox-list-label-${record.id}`;
            const isCrossed = crossedItems.indexOf(record.id) !== -1;
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
      <BottomNav />
      </>
  );
}