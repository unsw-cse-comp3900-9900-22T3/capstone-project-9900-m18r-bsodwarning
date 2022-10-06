import { Button } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';

export default function testpage() {

  const FetchTest = async () => {
    const response = await fetch('https://319e5298-9b95-4a74-8b93-bdc7890529d5.mock.pstmn.io/Login', {
      method:'GET',
      header:{
        'Content-type': 'application/json'
      }
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