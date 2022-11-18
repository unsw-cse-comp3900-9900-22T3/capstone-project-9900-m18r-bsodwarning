import { Avatar, Button } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';

export default function TryPage(){
  const x = React.useRef(null)
  const handleClick = () => {
    x.current.img = '/kcal.jpg'
  }
  return(
    <Box>
      <Button onClick={handleClick}>'123</Button>
      <Avatar ref={x} src='/nul.jpg'/>
      <Button onClick={e => console.log(window.location.hostname)}>location.hostname</Button>
      <Button onClick={e => console.log(window.location.port)}>location.hostname</Button>
    </Box>
  )
}