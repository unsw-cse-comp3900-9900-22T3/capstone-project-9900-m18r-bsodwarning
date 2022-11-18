import * as React from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

export default function SimpleHeader({ Title }){
  const navigate = useNavigate()
  return(
    <Box sx={{ flexGrow: 1, position: 'fixed', left:0, right:0, top:0, zIndex:1 }}>
      <AppBar position="static">
        <Toolbar sx={{ backgroundColor:'#F6FEEA'}}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block', color:'black' } }}
          >
            {Title}
          </Typography>
          <IconButton onClick={() => {navigate('/')}}>
            <HomeIcon/>
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}