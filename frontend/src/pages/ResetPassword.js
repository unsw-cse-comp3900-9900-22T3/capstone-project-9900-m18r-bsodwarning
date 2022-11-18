import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import { TextField, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { callApi } from '../components/FunctionCollect';
import { useSnackbar } from "notistack";
import SimpleHeader from '../components/SimpleHeader';

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

export default function ResetPassword() {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = data.get('newPWD')
    const Rpwd = data.get('RnewPWD')
    const email = localStorage.getItem('email')
    var pwd = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
    if(password !== Rpwd){
      enqueueSnackbar('Plese make sure you have input same password twice')
    } else if(!pwd.test(password)){
      enqueueSnackbar('Invalid password form')
    } else{
      callApi('/profile/alter', 'POST', { email, password})
      .then(data => {
        enqueueSnackbar(data.msg, { variant:'success'})
        navigate('/')
      })
      .catch(err => {
        enqueueSnackbar(err)
      })
    }
    }
  return(
    <Box component="form" onSubmit={handleSubmit} display={'flex'} flexDirection={'column'} alignItems='center' justifyContent={'center'} sx={{height:'100vh'}}>
      <SimpleHeader Title='Reset Password'/>
      <StyledBox>
        <Typography sx={{fontSize:'2em'}}>Reset Your Password</Typography>
        <Box noValidate sx={{ mt: 1 , width:'80%'}}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="newPWD"
            name="newPWD"
            label="new password"
            autoComplete="newPWD"
            type="password"
            autoFocus
            helperText="At least 6 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 digit, and cannot contain special characters "
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="RnewPWD"
            name="RnewPWD"
            label="Confirm password"
            type="password"
            autoComplete="RewPWD"
            autoFocus
          />
        </Box>
        <Button type="submit" variant='contained'>Submit</Button>
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
