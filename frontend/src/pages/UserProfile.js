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
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Button,ButtonGroup,Chip,Grid, TextField } from '@mui/material';
import RecipeCard from '../components/RecipeCard';
import { Stack } from '@mui/system';
import FeedIcon from '@mui/icons-material/Feed';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import KeyIcon from '@mui/icons-material/Key';
import MenuBookIcon from '@mui/icons-material/MenuBook';
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
          <Button startIcon={<ArrowBackIosNewIcon color='disabled'/>} onClick={()=>{navigate('/')}}/>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Profile
          </Typography>
          <Search component='form'>
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
              <Typography textAlign="center" onClick={()=>{navigate('/Login')}}>Log in</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleCloseUserMenu}>
              <Typography textAlign="center" onClick={()=>{navigate('/Signup')}}>Sign in</Typography>
            </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

const ProfileContent = () => {
  const myinfo = {
    'name':'kefka',
    'email': '123@abc.com',
    'gender': 'male',
    'age': '18',
    'Height': '180',
    'weight': '90',
    'level': 'Beginner',
    'time': '1',
    'preference': ['sea food', 'low calories', 'Soup'],
    'allergic': ['Sugar', 'Mango', 'Egg']
  }
  const [userInfo, setInfo] = React.useState(myinfo)
  const [page, setPage] = React.useState(true)
  const switchPage = () => {
    setPage(!page)
  }
  const [window, setWindow] = React.useState(true)
  const switchWindow = () => {
    setWindow(!window)
  }
  const published = ['1','2','3','4']
  const favorites = ['1', '2','3','4','5','6']
  const HeadImg = styled('img')(({theme})=>({
    height:'220px',
    width:'220px',
    borderRadius:'5px',
    objectFit:'cover'
  }))
  const CardDisplay = () => {
    return(
      <Grid item xs={12}>
          <Box display="flex" flexDirection={'row'} sx={{padding:'20px 0'}}>
            {window
              ? <Button disabled variant="contained" color='warning' sx={{marginRight:'30px'}}>Published Recipes {published.length}</Button>
              : <Button onClick={switchWindow} variant="contained" color='warning' sx={{marginRight:'30px'}}>Published Recipes {published.length}</Button>
            }
            {window
              ? <Button onClick={switchWindow} variant="contained" color='secondary'>Favorite Recipes {favorites.length}</Button>
              : <Button disabled variant="contained" color='secondary'>Favorite Recipes {favorites.length}</Button>
            }
          </Box>
          <Grid container spacing={4}>
            {window
              ? published.map((info, key) => (
                  <Grid item key={key} xs={6}>
                    <RecipeCard info={info} />
                  </Grid>
                ))
              : favorites.map((info,key) => (
                  <Grid item key={key} xs={6}>
                    <RecipeCard info={info} />
                  </Grid>
                ))
            }
          </Grid>
        </Grid>
    )
  }
  const InfoDisplay = () => {
    var newUserInfo = {...userInfo}
    const handleChange = (prop) => (e) => {
      newUserInfo = {...newUserInfo, [prop]: e.target.value}
    }
    const handleSubmit = () => {
      setInfo(newUserInfo)
    }
    const StyledBox = styled(Box) (({theme}) => ({
      width:'100%',
      display:'flex',
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
      marginTop:'40px'
    }))
    const ItemBox = styled(Box) (({theme}) => ({
      width:'45%',
      display:'flex',
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center'
    }))
    return(
      <Grid item xs={12} sx={{marginTop:'20px'}}>
        <Stack>
          <Typography fontSize={'2em'}>Basic Info</Typography>
          <StyledBox>
            <Typography>User Name</Typography>
            <Box width={'50%'}>
              <TextField id='name' size='small' defaultValue={userInfo.name} fullWidth onChange={handleChange('name')}/>
            </Box>
          </StyledBox>
          <StyledBox>
            <Typography>Email</Typography>
            <Box width={'50%'}>
              <TextField id='email' size='small' defaultValue={userInfo.email} fullWidth onChange={handleChange('email')}/>
            </Box>
          </StyledBox>
          <StyledBox>
            <ItemBox>
              <Typography>Gender</Typography>
              <TextField id='gender' size='small' defaultValue={userInfo.gender} onChange={handleChange('gender')}/>
            </ItemBox>
            <ItemBox>
              <Typography>Age</Typography>
              <TextField id='age' size='small' defaultValue={userInfo.age} onChange={handleChange('age')}/>
            </ItemBox>
          </StyledBox>
          <StyledBox>
            <ItemBox>
              <Typography>Height</Typography>
              <TextField id='Height' size='small' defaultValue={`${userInfo.Height}cm`} onChange={handleChange('Height')}/>
            </ItemBox>
            <ItemBox>
              <Typography>Weight</Typography>
              <TextField id='weight' size='small' defaultValue={`${userInfo.weight}kg`} onChange={handleChange('weight')}/>
            </ItemBox>
          </StyledBox>
          <StyledBox>
            <ItemBox>
              <Typography>Cooking Level</Typography>
              <TextField id='level' size='small' defaultValue={userInfo.level} onChange={handleChange('level')}/>
            </ItemBox>
          </StyledBox>
          <StyledBox>
            <Typography>The time you are willing to spend on cooking per meal</Typography>
            <TextField id='time' size='small' defaultValue={`${userInfo.time}h`} onChange={handleChange('time')}/>
          </StyledBox>
          <Box>
            <Typography sx={{marginTop:'20px'}}>Preference</Typography>
            <Box sx={{display:'flex', flexDirection:'row', flexWrap:'wrap', alignItems:'center'}}>
              {userInfo.preference.map((info,key) => (
                <Chip color="primary" label={`#${info}`} clickable key={key} sx={{ margin:'10px', marginTop:'20px'}}/>
              ))}
              <Chip color="primary" label="New" clickable sx={{ margin:'10px', marginTop:'20px'}} avatar={<AddCircleIcon color='primary'/>}/>
            </Box>
          </Box>
          <Box>
            <Typography sx={{marginTop:'20px'}}>Allergic or foods to avoid</Typography>
            <Box sx={{display:'flex', flexDirection:'row', flexWrap:'wrap', alignItems:'center'}}>
              {userInfo.allergic.map((info,key) => (
                <Chip color="primary" label={`#${info}`} clickable key={key} sx={{ margin:'10px', marginTop:'20px'}}/>
              ))}
              <Chip color="primary" label="New" clickable sx={{ margin:'10px', marginTop:'20px'}} avatar={<AddCircleIcon color='primary'/>}/>
            </Box>
          </Box>
          <ButtonGroup sx={{ width:'100%', display:'flex', justifyContent:'space-around', marginTop:'40px'}}>
            <Button variant='contained' color='success' onClick={handleSubmit}>Save Change</Button>
          </ButtonGroup>
        </Stack>
      </Grid>
    )
  }
  
  const navigate = useNavigate()
  return(
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ margin:'110px 0', width:'100%'}}>
      <Grid container marginTop={12} sx={{ border:'2px solid #c9f980',width:'964px', borderRadius:'5px', padding:'20px 30px'}}>
        <Grid item xs={12} sx={{borderBottom:'2px silid black'}}>
          <Box display="flex" flexDirection={'row'} alignItems='center' justifyContent={'space-between'} sx={{ borderBottom:'2px solid black', paddingBottom:'20px'}}>
            <HeadImg src='https://source.unsplash.com/random' alt='123'/>
            <Typography fontSize={'3em'} height='1.5em' >
              {page
                ?`Hi,${userInfo.name}! ^_^`
                : `${userInfo.name}`
              }
            </Typography>
            <Box display={'flex'} flexDirection='column'>
              <Tooltip title={page?'Basic Infomation':'Recipe Infomation'}>
                <IconButton onClick={switchPage}>
                  {page
                    ? <FeedIcon/>
                    : <MenuBookIcon/>
                  }
                </IconButton>
              </Tooltip>
              <Tooltip title={'Change password'}>
                <IconButton sx={{marginBottom:'176px'}} onClick={() => {navigate('/reset')}}>
                  <KeyIcon/>
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Grid>
        {page
          ? <CardDisplay/>
          : <InfoDisplay/>
        }
      </Grid>
    </Box>
  )
}

export default function UserProfile() {
  return(
    <>
      <Header />
      <ProfileContent/>
    </>
  )
}
