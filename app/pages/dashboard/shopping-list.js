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

function ItemHeader(props) {
  return (
    <>
      <Typography component="span" sx={{ fontSize: 18, fontWeight: 'bold'}}>{props.name}</Typography>
      {props.quantity && <Typography component="span" sx={{ fontSize: 15 }}> (qty {props.quantity})</Typography>}
    </>
  )
}

export default function Dashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { pb, authUser, isLoggedIn, isLoadingApp } = useAppContext();
  const [checked, setChecked] = React.useState([0]);
  const [subscribed, setSubscribed] = React.useState(false);
  const shoppingList = useQuery(["shoppingList"], async() => {
    const data = await pb.collection("shopping_list").getFullList(200, {
      expand: 'added_by',
      sort: "-created",
    });
    return data;
  });

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };  

  useEffect(() => {
    if(!subscribed) {
      console.log('subscribing to shopping_list collection');
      pb.collection('shopping_list').subscribe('*', (event) => { 
        console.log('shopping_list collection refreshing...', event);
        queryClient.invalidateQueries(['shoppingList']);
      });
      setSubscribed(true);
    }
  },[]);

  useEffect(() => {
    return () => {
      if(subscribed){
        console.log('unsubscribing from shopping_list collection');
        pb.collection('shopping_list').unsubscribe();
      }
    }
  },[subscribed]);

  useEffect(() => {
    if(!isLoadingApp && !isLoggedIn){
      router.push('/');
    }
  },[isLoadingApp, isLoggedIn]);

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
        <Typography variant="h4" component="h1" gutterBottom>
          Shopping list
        </Typography>
        <List sx={{ width: '100%', maxWidth: 580, bgcolor: 'background.paper' }}>
          {shoppingList.data?.map((record) => {
            const labelId = `checkbox-list-label-${record.id}`;
            const primary = <ItemHeader name={record.item} quantity={record.quantity}></ItemHeader>;
            const secondary = `${record?.expand?.added_by?.name ? 'By ' + record?.expand?.added_by?.name + ' - ' : ''} ${formatDistanceToNow(new Date(record.created))} ago`;

            return (
              <ListItem 
                key={record.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="edit">
                    <ModeEditOutlineIcon />
                  </IconButton>
                }
                disablePadding
                divider
              >
                <ListItemButton role={undefined} onClick={handleToggle(record.id)}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(record.id) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={primary} secondary={secondary}/>
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