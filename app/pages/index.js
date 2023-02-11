import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '../components/Link';
import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/router'
import Layout from '@/components/Layout';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import useLogin from '@/hooks/useLogin';
import useLoggedUser from '@/hooks/useLoggedUser';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function Index() {
  const router = useRouter();
  const { mutate: login, isLoading, isError, isSuccess } = useLogin();
  const user = useLoggedUser();

  useEffect(() => {
    if (!user.isLoading && user.data) {
      router.push('/dashboard/shopping-list');
    }
  }, [user.isLoading, user.data]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    login({ email: data.get('email'), password: data.get('password')});
  };

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