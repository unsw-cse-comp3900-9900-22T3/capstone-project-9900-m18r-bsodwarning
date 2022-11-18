import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { callApi } from '../components/FunctionCollect';
import { useSnackbar } from "notistack";
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

export default function Login() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email')
    const password = data.get('password')
    var reg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
    if(!reg.test(email)){
      enqueueSnackbar('Invalid email address')
    }else{
      callApi(`/login`, 'POST', {email,password})
      .then(data => {
        console.log(data)
        localStorage.setItem('email',email)
        localStorage.setItem('avatar',data.avatar)
        enqueueSnackbar('Login Succeed', { variant:'success'})
        navigate('/')
      })
      .catch(err => {
        console.log(err)
        enqueueSnackbar(err)
      })
    }
  };
  const StyledButtonAlt = styled(Button)(({ theme }) => ({
    color:'black',
    backgroundColor:'#F6FEEA',
    border:'1px solid black',
    '&:hover': {
      border:'1px solid #F6FEEA',
      color:'black'
    }
  }))
  return (
    <ThemeProvider theme={theme}>
      <SimpleHeader Title='Log in'/>
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
          <Typography component="h1" variant="h5">
            Welcome to the taste studio
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {/* <input type="text" title="email" required pattern="^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$" title="请输入正确的邮箱格式" /> */}
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
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <StyledButtonAlt
              type="submit"
              fullWidth
            >
              Log In
            </StyledButtonAlt>
            <Grid container>
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  to={'/signup'}
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}