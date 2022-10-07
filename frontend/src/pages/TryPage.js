import { Button } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';

export default function testpage() {

  const FetchTest = async () => {
    const response = await fetch('http://42.192.146.124:3010/login', {
      method:'POST',
      header:{
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        'email':'eiffelkefka@gmail.com',
        'password':'abcdefg'
      })
    })
    const data = await response.json()
    console.log(data)
  } 
  return(
    <Box sx={{width:'100%', marginTop:'20vh', display:'flex', justifyContent:'center'}}>
      <Button onClick={FetchTest}>test1</Button>
    </Box>
  )
}