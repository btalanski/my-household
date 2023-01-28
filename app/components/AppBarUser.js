import * as React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@/components/Link';
import useLogout from '@/hooks/useLogout';
import { useAppContext } from '@/context/AppContext';

export default function AppBarUser() {
  const router = useRouter();
  const { setIsLoggedIn } = useAppContext();
  const { mutate: logOut, isSuccess } = useLogout();

  const handleLogout = () =>{
    logOut();
  }

  useEffect(() => {
    if(isSuccess){
      setIsLoggedIn(false);
      router.push('/');
    }
  },[isSuccess]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              MyHousehold
            </Typography>
          <Button color="inherit" onClick={() => handleLogout()}>Sign out</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}