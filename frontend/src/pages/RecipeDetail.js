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
import { useParams } from 'react-router-dom';
import { Button, ButtonGroup, Grid, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
// import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { Stack } from '@mui/system';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import AccountCircle from '@mui/icons-material/AccountCircle';
import TextField from '@mui/material/TextField';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RecipeCard from '../components/RecipeCard';
import { callApi } from '../components/FunctionCollect';
import { DeleteForever } from '@mui/icons-material';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ExploreIcon from '@mui/icons-material/Explore';
import { useSnackbar } from "notistack";

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

const RecipeContent = ( {info} ) => {
  const [allInfo, setAllInfo] = React.useState('')
  React.useEffect(() => {
    const email = localStorage.getItem('email')
    callApi(`/recipe/details/${info}/${email ? email : '0'}`, 'GET')
      .then(data=>{
        console.log(data)
        setAllInfo(data.detail)
      })
      .catch(err => {console.log(err)})
  },[info])
  const handleLike = () => {
    callApi(allInfo['likeState'] ? '/user_cancel_like' :`/user_like`, 'POST', {"user_email":localStorage.getItem('email'),"recipeid":info})
      .then(data => {
        console.log(data)
        var newData = JSON.parse(JSON.stringify(allInfo));
        if(newData.likeState){
          newData.likeCount = newData.likeCount - 1
        }else {
          newData.likeCount = newData.likeCount + 1
        }
        newData.likeState = !newData.likeState
        
        setAllInfo(newData)
      })
      .catch(err => console.log(err))
  }
  const handleSubcrib = () => {
    const email = localStorage.getItem('email')
    callApi(`${allInfo.subscribeState ? '/user_cancel_subscribe' : '/user_subscribe'}`, 'POST',{"user_email":email,"subscribed_email":allInfo.author})
      .then(data => {
        console.log(data)
        var newData = JSON.parse(JSON.stringify(allInfo));
        newData.subscribeState = !newData.subscribeState
        setAllInfo(newData)
      })
      .catch(err => {
        console.log(err)
      })
  }
  const [value, setValue] = React.useState(0)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  }
  // const [markState, setMark] = React.useState(allInfo['CollectionState'] ? allInfo['CollectionState'] : false)
  const handleMark = () => {
    callApi(allInfo['CollectionState'] ? '/user_cancel_collection' :`/user_collection`, 'POST', {"user_email":localStorage.getItem('email'),"recipeid":info})
      .then(data => {
        console.log(data)
        var newData = JSON.parse(JSON.stringify(allInfo));
        newData.CollectionState = !newData.CollectionState
        setAllInfo(newData)
      })
      .catch(err => console.log(err))
  }
  const Tittleimg= styled('img')(({theme})=>({
    width:'685px',
    height:'378px',
    borderRadius:'12px'
  }))
  const StepImg = styled('img')(({theme}) => ({
    width:'390px',
    height:'260px',
    borderRadius:'10px'
  }))
  function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  const handleSubmit = (e) => {
    if(e.keyCode===13){
      const email = localStorage.getItem('email')
      const avatar = localStorage.getItem('avatar')
      callApi(`/addcomment`, 'POST', {email ,"content":e.target.value,'recipeid':info})
        .then(data => {
          console.log(data)
          var newData = JSON.parse(JSON.stringify(allInfo));
          newData.comment = [...newData.comment, {avatar, 'userid': email, 'content': e.target.value}]
          setAllInfo(newData)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
  const navigate = useNavigate()
  const handleDelete = () => {
    callApi(`/delete/recipe/${info}`, 'POST', {'email':localStorage.getItem('email')})
      .then(data => {
        console.log(data)
        navigate(`/profile/${localStorage.getItem('email')}`)
      })
      .catch(err => {
        console.log(err)
      })
  }
  const handleDelComment = (commentid) => {
    callApi('/deleteCommentById', 'POST', {commentid})
      .then(data => {
        console.log(data)
        var newData = JSON.parse(JSON.stringify(allInfo));
        newData.comment = (newData.comment).filter(item => item.commentid !== commentid)
        setAllInfo(newData)
      })
      .catch(err => {
        console.log(err)
      })
  }
  return(
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ marginTop:'64px', width:'100%'}}>
      <Grid container width='700px' marginTop={12}>
        {/* image */}
        {allInfo.cover &&
          <Grid item xs={12}>
            <Tittleimg src={allInfo.cover} alt='123' sx={{objectFit:'cover'}}/>
          </Grid>
        }
        {/* Tittle */}
        <Grid item xs={12} marginTop={5} display="flex" flexDirection='row' alignItems="center" justifyContent={'space-between'}>
          <Box>
            <Typography fontSize={'2em'}>{allInfo.title ? allInfo.title :`Dessert Crepes${info}`}</Typography>
            <Typography>{allInfo.description ? allInfo.description : 'There is no description'}</Typography>
          </Box>
          {(allInfo.author !== localStorage.getItem('email')) && <Button startIcon={allInfo['likeState']?<ThumbUpAltIcon/>:<ThumbUpOffAltIcon/>} onClick={handleLike}>{`${allInfo['likeCount']}`}</Button>}
        </Grid>
        {/* avatar and subcrib */}
        <Grid item xs={12} marginTop={3} display="flex" flexDirection='row' alignItems="center" justifyContent={'space-between'}>
          <Box display="flex" flexDirection='row' alignItems="center">
            <Avatar src='https://source.unsplash.com/random' alt='123'/>
            <Typography fontSize={'1em'} margin='0 20px'>{allInfo.author ? allInfo.author: 'uploader'}</Typography>
          </Box>
          {(allInfo.author !== localStorage.getItem('email')) && <Button variant="outlined" onClick={handleSubcrib}>{allInfo.subscribeState? 'unsubscribe':`subcribe`}</Button>}
        </Grid>
        {/* tags */}
        <Grid item xs={12} marginTop={5}>
          <Typography fontSize={'2em'}>TAGS</Typography>
          <Box display={'flex'} flexWrap={'wrap'}>
            {/* {allInfo.category && (allInfo.category).map((info, key) => (
              <Chip  color="primary" label={`#${info}`} clickable key={key} sx={{ margin:'10px'}}/>
            ))} */}
          </Box>
        </Grid>
        {/* ingredients */}
        <Grid item xs={12} marginTop={5}>
          <Typography fontSize={'2em'}>Ingredients</Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650, border:0 }} aria-label="simple table">
              <TableBody>
                {allInfo.ingredients && (allInfo.ingredients).map((info, key)=>(
                  <TableRow
                    key={key}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                    </TableCell>
                    <TableCell align="center">{info.amount + info.ingredient}</TableCell>
                    <TableCell align="right">{}</TableCell>
                  </TableRow>
                ))}
                <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {'Total Calories'}
                    </TableCell>
                    <TableCell align="center">{allInfo.calories ? allInfo.calories :`unknown`}{'  kcal'}</TableCell>
                    <TableCell align="right" sx={{width:'33%'}}>
                      <LunchDiningIcon/>
                      {/* {`Exceeded your target calories`} */}
                    </TableCell>
                  </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        {/* step */}
        { allInfo.instructions_list && 
          <Grid item xs={12} marginTop={5}>
          <Typography fontSize={'2em'} sx={{marginBottom:'16px'}}>Recipe Step</Typography>
          <Stack spacing={2}>
            {(allInfo.instructions_list).map((info, key) => (
              <Box key={key}>
              <Typography fontSize={'1.2em'}>STEP {key+1}/{(allInfo.instructions_list).length}</Typography>
              <Box display={'flex'} flexDirection='row'>
                {(allInfo.stepImage_list && (allInfo.stepImage_list[key] !=="http://localhost:3000/upload_Holder.png"))
                && <StepImg src={`${allInfo.stepImage_list[key]}`} alt={'123'} sx={{objectFit:'cover'}}/>}
                <Typography sx={{paddingLeft:'1em'}}>{info}</Typography>
              </Box>
            </Box>
            ))}
          </Stack>
        </Grid>
        }
        {/* comment & recommendation */}
        <Grid item xs={12} marginTop={5}>
          <Box sx={{width:'100%'}}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', display:'flex', alignContent:'center', justifyContent:'center' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label='Recommendation' {...a11yProps(0)}/>
                <Tab label='Comments' {...a11yProps(1)}/>
              </Tabs>
            </Box>
            {/* recommendation */}
            <TabPanel value={value} index={0}>
              <Grid container spacing={2} width={'100%'}>
              {allInfo && (allInfo.recommendation).map((info, key) => (
                <Grid item xs={4}key={key}>
                  <Box display={'flex'} flexDirection='row'>
                    <RecipeCard info={info}/>
                    {/* <Typography sx={{paddingLeft:'1em'}}>{info.Description}</Typography> */}
                  </Box>
                </Grid>
              ))}
              </Grid>
            </TabPanel>
            {/* comment */}
            <TabPanel value={value} index={1}>
              {allInfo && (allInfo.comment).map((info,key) => (
                <Box key={key} display='flex' flexDirection={'row'} alignContent='center' marginTop={1} sx={{width:'100%', justifyContent:'space-between'}}>
                  <Box display='flex' flexDirection={'row'} alignContent='center' marginTop={1}>
                    <Avatar src={info.avatar} sx={{ width: 24, height: 24 }}/>
                    <Typography>{info.userid}</Typography>
                    <Typography key={key}>:{info.content}</Typography>
                  </Box>
                  {(localStorage.getItem('email')===info.userid) && <Button onClick={e => handleDelComment(info.commentid)}>DELETE</Button> }
                </Box>
              ))}
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                <TextField id="newComment" label="leave a comment" variant="standard" onKeyUp={handleSubmit}/>
              </Box>
            </TabPanel>
          </Box>
        </Grid>
      </Grid>
      {/* right bottom button group */}
      {(allInfo.author !== localStorage.getItem('email'))
        ?
        <ButtonGroup sx={{position:'fixed', right:'1em', bottom:'1em'}} orientation="vertical">
          <Tooltip title='like'><Button startIcon={allInfo['likeState']?<ThumbUpAltIcon/>:<ThumbUpOffAltIcon/>} onClick={handleLike}/></Tooltip>
          <Tooltip title='favorite'><Button startIcon={allInfo.CollectionState ?<FavoriteIcon/>:<FavoriteBorderIcon/>} onClick={handleMark}/></Tooltip>
        </ButtonGroup>
        :<ButtonGroup sx={{position:'fixed', right:'1em', bottom:'1em'}} orientation="vertical">
          <Tooltip title='edit'><Button startIcon={<EditIcon/>} onClick={() => navigate(`/recipeEdit/${info}`)}/></Tooltip>
          <Tooltip title='delete'><Button startIcon={<DeleteForever/>} onClick={handleDelete}/></Tooltip>
        </ButtonGroup>
        }
    </Box>
  );
}

export default function RecipeDetail() {
  const param = useParams();

  return(<>
  <Header/>
  <RecipeContent info={param.id}/>
  </>);
}