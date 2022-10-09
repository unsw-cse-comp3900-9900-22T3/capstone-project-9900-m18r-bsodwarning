import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import { TextField, Button, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

const StyledBox = styled(Box)(({theme}) => ({
  border:'1px solid black', 
  width:'600px', 
  height:'400px', 
  borderRadius:'20px',
  display:'flex',
  flexDirection:'column',
  justifyContent:'space-between',
  alignItems:'center',
  padding:'20px 0'
}))

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

const Header = () => {
  const navigate = useNavigate()
  return(
    <Box sx={{ flexGrow: 1, position: 'fixed', left:0, right:0, top:0, zIndex:1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Reset Password
          </Typography>
          <IconButton onClick={() => {navigate('/')}}>
            <HomeIcon/>
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default function ResetPassword() {

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data.get('newPWD'))
  }

  return(
    <Box display={'flex'} flexDirection={'column'} alignItems='center' justifyContent={'center'} sx={{height:'100vh'}}>
      <Header />
      <StyledBox>
        <Typography sx={{fontSize:'2em'}}>Reser Your Password</Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="newPWD"
            label="new password"
            name="newPWD"
            autoComplete="newPWD"
            autoFocus
          >
          </TextField>
        </Box>
        <Button variant='contained'>Submit</Button>
        <Link
          href="#"
          variant="body2"
          to={'/login'}
        >
          {"Go back to the login screen."}
        </Link>
      </StyledBox>
      
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Box>
  )
}
