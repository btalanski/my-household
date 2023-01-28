import * as React from 'react';
import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/router'
import useLogin from '@/hooks/useLogin';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '../components/Link';
import Layout from '@/components/Layout';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

export default function Index() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAppContext();
  const { mutate: login, isLoading, isError, isSuccess } = useLogin();

  useEffect(() => {
    if(isLoggedIn || isSuccess){
      setIsLoggedIn(true);
      router.push('/dashboard');
    }
  },[isLoggedIn, isSuccess]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    login({ email: data.get('email'), password: data.get('password')});
  };

  return (
    <Container maxWidth="sm">
      <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Stack sx={{ width: '100%' }} spacing={2}>
            {isError && <Alert severity="error">Account not found.</Alert>}
            {isSuccess && <Alert severity="success">Logged in. Redirecting...</Alert>}
          </Stack>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Stack sx={{ width: '100%' }} spacing={2}>
              <LoadingButton
                loading={isLoading}
                loadingPosition="start"
                startIcon={<></>}
                variant="contained"
                type="submit"
              >
                <span>Sign in</span>
              </LoadingButton>
            </Stack>
            <Grid container sx={{marginTop: 2}}>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/" variant="body2">
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
    </Container>
  );
}

Index.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}