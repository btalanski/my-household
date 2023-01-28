import * as React from 'react';
import { useRouter } from 'next/router'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@/components/Link';

export default function AppBarSimple() {
  const router = useRouter()
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              MyHousehold
            </Typography>
          <Button color="inherit" onClick={() => router.push('/login')}>Sign in</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}