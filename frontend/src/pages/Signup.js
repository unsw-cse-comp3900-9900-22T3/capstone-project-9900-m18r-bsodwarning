import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { callApi } from '../components/FunctionCollect';
import { useSnackbar } from 'notistack';
import SimpleHeader from '../components/SimpleHeader';
import { styled } from '@mui/material/styles';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();
const StyledButtonAlt = styled(Button)(({ theme }) => ({
  color:'black',
  backgroundColor:'#F6FEEA',
  border:'1px solid black',
  '&:hover': {
    border:'1px solid #F6FEEA',
    color:'black'
  }
}))
export default function SignUp() {
  const navigate = useNavigate()
  const {enqueueSnackbar} = useSnackbar()
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
      name: data.get('name'),
    });
    const email = data.get('email')
    const password = data.get('password')
    const username = data.get('name')
    var reg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
    var pwd = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
    if(!reg.test(email)){
      enqueueSnackbar('Invalid email address')
    }else if(!pwd.test(password)){
      enqueueSnackbar('Invalid password')
    }else{
      callApi(`/register`, 'POST', {username,email,password})
      .then(data => {
        console.log(data)
        localStorage.setItem('email',email)
        navigate('/welcome')
        enqueueSnackbar('Sign up Succeed', { variant:'success'})
      })
      .catch(err => {
        console.log(err)
        enqueueSnackbar(err)
      })
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <SimpleHeader Title='Sign up'/>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: '20vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  helperText="At least 6 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 digit, and cannot contain special characters "
                />
                
              </Grid>
            </Grid>
            <StyledButtonAlt
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </StyledButtonAlt>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2" to={'/Login'}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}