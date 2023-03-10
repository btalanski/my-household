import * as React from 'react';
import { useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from "react-query";
import { useRouter } from 'next/router'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useAppContext } from '@/context/AppContext';
import LayoutUser from '@/components/LayoutUser';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import AddAction from '@/components/ShoppingList/AddAction';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { fetchShoppingList, subscribeToShoppingList, unsubscribeToShoppingList } from '@/utils/api';

export default function Dashboard() {
  const router = useRouter();
  const [checked, setChecked] = React.useState([0]);
  const { pb, authUser, isLoggedIn, isLoadingApp } = useAppContext();


  useEffect(() => {
    if(!isLoadingApp && !isLoggedIn){
      router.push('/');
    }
  },[isLoadingApp, isLoggedIn]);


  if(isLoadingApp || !isLoggedIn || !authUser){
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Typography variant="h4" component="h1" gutterBottom>
          To dos
        </Typography>
        <List sx={{ width: '100%', maxWidth: 460, bgcolor: 'background.paper' }}>
          {[].map((record) => {
            const labelId = `checkbox-list-label-${record.id}`;

            return (
              <ListItem key={record.id}>
                <ListItemButton role={undefined} onClick={handleToggle(record.id)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(record.id) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={record.item} />
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