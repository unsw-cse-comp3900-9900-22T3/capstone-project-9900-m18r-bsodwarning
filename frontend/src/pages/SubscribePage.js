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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from "notistack";
import { Button, Card, Grid, CardHeader, Avatar, CardContent,Link } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { red } from '@mui/material/colors';
import { Stack } from '@mui/system';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import RecipeCard from '../components/RecipeCard'
import { callApi } from '../components/FunctionCollect';
import ExploreIcon from '@mui/icons-material/Explore';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const Header = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar();
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
  const [email, setEmail] = React.useState('')
  const avatar = localStorage.getItem('avatar')
  React.useEffect(() => {
    setEmail(localStorage.getItem('email'))
  },[])
  const handleSearch = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget);
    navigate(`/search/${data.get('searchInfo')}`)
  }
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
            Taste studio
          </Typography>
          {email &&
          <IconButton onClick={e => navigate('/subscribe')}>
            <ExploreIcon/>
          </IconButton>}
          <Search>
            <Box  component='form' onSubmit={handleSearch}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder= 'search'
                inputProps={{ 'aria-label': 'search' }}
                name='searchInfo'
              />
              <IconButton>
                <PhotoCameraIcon/>
              </IconButton>
            </Box>
          </Search>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {avatar
                ?<Avatar alt="UserName" src={avatar}/>
                :<Avatar>U</Avatar>
                }
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
            {email === ''
            ?<MenuItem onClick={() => handleCloseUserMenu}>
              <Typography textAlign="center" onClick={()=>{navigate('/Login')}}>{'log in'}</Typography>
            </MenuItem>
            :<MenuItem onClick={() => handleCloseUserMenu}>
              <Typography textAlign="center" onClick={()=>{navigate(`/profile/${localStorage.getItem('email')}`)}}>{'Profile'}</Typography>
            </MenuItem>
            }
            {email === ''
            ?<MenuItem onClick={() => handleCloseUserMenu}>
              <Typography textAlign="center" onClick={()=>{navigate('/Signup')}}>{'Sign in'}</Typography>
            </MenuItem>
            :<MenuItem onClick={() => handleCloseUserMenu}>
              <Typography textAlign="center" onClick={()=>{localStorage.setItem('email', ''); setEmail(''); enqueueSnackbar('You have logged out')}}>{'log out'}</Typography>
            </MenuItem>
            }
            
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

function Body({info}) {
  const navigate = useNavigate()
  const myInfo = info
  const style = {
    width: '100%',
    bgcolor: 'background.paper',
  }
  const [selectedPart, setPart] = React.useState({
    "s":'1',
    "List":[],
    'Pool':undefined
  })
  function handleClickAvatar(prop) {
    const newPart = {
      's':'3',
      'List':[],
      'Pool':(myInfo.RecipeList).filter(item => item.uploader_email === prop)
    }
    console.log(newPart)
    setPart(newPart)
  }
  const [orderBy, setOrder] = React.useState(true)
  function handleChangeOrder(){
    setOrder(!orderBy)
  }
  React.useEffect(() => {
    if((selectedPart['s'] === '1') && myInfo) {
      const newPart = (myInfo.RecipeList).slice(0, 5)
      setPart({
        "s":'2',
        "List":newPart,
        'Pool':undefined
      })
    }else if((selectedPart['s'] === '3') && selectedPart['Pool']){
      setPart({
        "s":'2',
        "List":selectedPart['Pool'].slice(0, 5),
        'Pool':[...selectedPart['Pool']]
      })
    }
    const scrollListen = () => {
      var scrollTopHeight = document.body.scrollTop || document.documentElement.scrollTop
      var showHeight = window.innerHeight
      var allHeight = document.body.scrollHeight
      if (allHeight + 50 < scrollTopHeight + showHeight) {
        if(selectedPart['s'] === '2'){
          if(selectedPart['Pool']){
            const newPart = selectedPart['Pool'].slice(0, selectedPart['List'].length+5)
            console.log(newPart)
            console.log(111)
            setPart({
              "s":'2',
              "List":newPart,
              'Pool':[...selectedPart['Pool']]
            })
          }else{
            const newPart = (myInfo.RecipeList).slice(0, selectedPart['List'].length+5)
            console.log(222)
            console.log(newPart)
            setPart({
              "s":'2',
              "List":newPart,
              'Pool':undefined
            })
          }
          
        } 
      }
    }
    window.addEventListener("scroll", scrollListen)
    return () => window.removeEventListener("scroll", scrollListen)
  }, [selectedPart, myInfo])
  return(
    <Box sx={{marginTop:'100px', width:'100%', display:'flex', justifyContent:'center', minWidth:'1000px'}}>
      <Grid container sx={{width:'95%'}} spacing={5}>
        {/* User Info */}
        <Grid item xs={4}>
          <Card sx={{ display: 'flex', flexDirection: 'column', position: 'relative', padding:'10px'}}>
          <CardHeader
            avatar={myInfo
              ?<Avatar src={myInfo.avatar} sx={{ bgcolor: red[500] }}/>
              :<Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                R
              </Avatar>
            }
            title={myInfo.username}
            sx={{margin:'10px 0 0 10%'}}
          />
          <CardContent sx={{margin:'30px 0 0 0'}}>
            <Stack direction={'row'} sx={{width:'100%', display:'flex', justifyContent:'space-around'}}>
              <Typography align='center'>{myInfo &&myInfo.follow_count}<br/>{'Follow'}</Typography>
              <Typography align='center'>{myInfo &&myInfo.follower_count}<br/>{'Follower'}</Typography>
              <Typography align='center'>{myInfo &&myInfo.post}<br/>{'Post'}</Typography>
            </Stack>
          </CardContent>
          </Card>
        </Grid>
        {/* Add part */}
        <Grid item xs={8}>
          <Card sx={{width:'100%', height:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
            <IconButton sx={{width:'100%', height:'100%'}} onClick={()=>navigate('/recipecreate')}  onScroll={e => console.log(1)}>
              <AddCircleOutlineIcon/>
            </IconButton>
          </Card>
        </Grid>
        {/* Follow List */}
        <Grid item xs={4}>
          <Card sx={{ display: 'flex', flexDirection: 'column', position: 'relative', padding:'20px'}}>
            <List sx={style} component="nav" aria-label="mailbox folders">
              {myInfo.follow && (myInfo.follow).map((info, index) => (
                <React.Fragment key={index}>
                  <Box sx={{display:'flex', flexDirection:'row'}}>
                    <ListItem button onClick={e => handleClickAvatar(info.email)}>
                      <IconButton>
                        {info.avatar
                        ?<Avatar src={info.avatar} alt='U'/>
                        :<Avatar>U</Avatar>
                        }
                        
                      </IconButton>
                      <ListItemText primary={info.email} sx={{marginLeft:'20px'}}/>
                    </ListItem>
                    <IconButton>
                        <DensitySmallIcon/>
                      </IconButton>
                  </Box>
                  {index === (myInfo.follow.length-1) ?<></> :<Divider />}
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Grid>
        {/* Recipe */}
        <Grid item xs={8}>
          <Stack spacing={2}>
            <Card>
              {orderBy
                ?<Button disabled color='warning'>By time</Button>
                :<Button onClick={handleChangeOrder} color='warning'>By time</Button>
              }
              {orderBy
                ?<Button onClick={handleChangeOrder} color='secondary'>By Like</Button>
                :<Button disabled color='warning'>By Like</Button>
              }
            </Card>
            {selectedPart['List'] && selectedPart['List'].map((info,index) => (
              <RecipeCard info={info.recipe_id} key={index}/>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}

export default function SubscribePage() {
  const [myInfo, setMyInfo] = React.useState('')
  React.useEffect(() => {
    const myEmail = localStorage.getItem('email')
    callApi(`/subscribe/${myEmail}`, 'GET')
    .then(data => {
      console.log(data)
      setMyInfo(data)
    })
    .catch(err => console.log(err))
  },[])
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
  return(
    <React.Fragment>
      <Header/>
      <Body info={myInfo}/>
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
    </React.Fragment>
  )
}
