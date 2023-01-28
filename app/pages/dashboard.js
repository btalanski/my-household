import * as React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '../components/Link';
import { useAppContext } from '@/context/AppContext';
import LayoutUser from '@/components/LayoutUser';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function Dashboard() {
  const router = useRouter();
  const { authUser, isLoggedIn, isLoadingApp } = useAppContext();
  
  useEffect(() => {
    if(!isLoadingApp && !isLoggedIn){
      router.push('/');
    }
  },[isLoadingApp, authUser]);

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
    <Container maxWidth="sm">
      <Box sx={{
        marginTop: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Hello, {authUser?.name}! 👋
        </Typography>
      </Box>
    </Container>
  );
}

Dashboard.getLayout = function getLayout(page) {
  return (
    <LayoutUser>{page}</LayoutUser>
  )
}