import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import RecipeCard from '../components/RecipeCard';
import { Grid } from '@mui/material';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const Search = styled('div')(({ theme }) => ({
    position: 'relative',

    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    marginRight:'2em',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 1),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '18ch',
        '&:focus': {
          width: '30ch',
        },
      },
    },
  }));

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

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
            Taste studio
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder= 'search'
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
            <MenuItem onClick={() => handleCloseUserMenu}>
              <Typography textAlign="center" onClick={()=>{navigate('Login')}}>{'Log in'}</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleCloseUserMenu}>
              <Typography textAlign="center" onClick={()=>{navigate('Signup')}}>{'Sign in'}</Typography>
            </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

const Advertisement = () => {
  const wdt = document.documentElement.clientWidth * 0.4 + 'px';
  const StyledImg = styled('img')(({theme}) => ({
    width:'57vw',
    height:wdt,
    objectFit:'cover'
  }));
  const StyledBox = styled(Box)(({theme}) => ({
    width:'43vw',
  }))
  const this_style = ({
    display:'flex',
    flexdirection:'row',
    marginTop:'64px'
  })
  return(
    <Box style={this_style}>
      <StyledImg
      src='https://source.unsplash.com/random'
      alt='nothing'
      />
      <StyledBox display="flex" justifyContent="center" alignItems="center">
        <Typography variant="overline" fontSize={20}>
        Cooking with Elegance<br/>Join us!
        </Typography>
      </StyledBox>
    </Box>
  );
}

const RecipeDisplay = () => {
  const cardlist = [1,2,3,4,5,6,7,8,9,10]
  const tags = ['meat', 'vagatable', 'egg', 'fry']

  return (
    <Box sx={{ flexGrow:1, margin:6 }} display="flex" justifyContent="center" alignItems="center">
      <Grid container spacing={2} width={1100} >
        <Grid item xs={12}>
          <Typography variant='h3' display="flex" justifyContent="center" alignItems="center">What do you want to cook?</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box display={'flex'} flexWrap={'wrap'} sx={{ padding:'0 10%'}}>
          {tags.map((info, key) => (
              <Chip  color="primary" label={`#${info}`} clickable key={key} sx={{ margin:'10px'}}/>
            ))}
          </Box>
        </Grid>
        {cardlist.map((info, index) => (
          <Grid item xs={4} key={index}>
            <RecipeCard info={info}/>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

const BottomInfo = () => {
  return (
    <Grid
      container
      spacing={2}
      marginLeft='15vw'
      marginRight='15vw'
      sx={{ width:'70vw'}}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Grid item>Contact us</Grid>
      <Divider orientation="vertical" flexItem/>
      <Grid item>Join us</Grid>
      <Divider orientation="vertical" flexItem/>
      <Grid item>Become a partner</Grid>
    </Grid>
  );
}

export default function Home() {
  function Copyright() {
    return (
      <Typography variant="body2" color="text.secondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }
  return <>
  {/* Top */}
  <Header/>
  {/* main */}
  <Advertisement/>
  <RecipeDisplay />
  <BottomInfo />
  {/* Footer */}
  <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </Box>
      {/* End footer */}
  </>
}