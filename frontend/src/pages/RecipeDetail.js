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
import { Button, ButtonGroup, Chip, Grid, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
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
import FavoriteIcon from '@mui/icons-material/Favorite';

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
            Taste studio
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

const RecipeContent = ( {info} ) => {
  const [LikeState, setLike] = React.useState([false,123])
  const handleLike = () => {
    LikeState[0]
    ? setLike([!LikeState[0],LikeState[1]-1])
    : setLike([!LikeState[0],LikeState[1]+1])
  }
  const [SubcribState, setSubcrib] = React.useState(false)
  const handleSubcrib = () => {
    setSubcrib(!SubcribState)
  }
  const [value, setValue] = React.useState(0)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  }
  const [markState, setMark] = React.useState(false)
  const handleMark = () => {
    setMark(!markState)
  }
  const tags = ['beef', 'tomato', 'sauce', 'tomato', 'sauce', 'sauce', 'tomato', 'sauce', 'tomato', 'sauce', 'tomato', 'sauce']
  const Ingredients = [
    {'name':'xxx spoon', 'type': 'Ingredients1', 'calories': '100'},
    {'name':'xxx gram', 'type': 'Ingredients2', 'calories': '120'}
  ]
  function sum(arr) {
    var s = 0;
    for (var i=arr.length-1; i>=0; i--){
      s += Number(arr[i].calories)
    }
    return s;
  } 
  const RecipeStep = [
    {'img':'https://source.unsplash.com/random', 'Description':' this is Description of step 1'},
    {'img':'https://source.unsplash.com/random', 'Description':' this is Description of step 2'}
  ]
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
  const Recommendation = [
    {'img':'https://source.unsplash.com/random', 'Description':' this is Description of Recommendation 1'},
    {'img':'https://source.unsplash.com/random', 'Description':' this is Description of Recommendation 2'}
  ]
  const [comments,setComment] = React.useState([
    {'user':'laurance', 'comment':'I like this'},
    {'user':'Bian shengtao', 'comment':'not bad'},
  ])
  const handleSubmit = (e) => {
    const newComment = [...comments,{'user':'me', 'comment': e.target.value}]
    if (e.keyCode === 13){
      setComment(newComment)
    }
  }
  return(
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ marginTop:'64px', width:'100%'}}>
      <Grid container width='700px' marginTop={12}>
        {/* image */}
        <Grid item xs={12}>
          <Tittleimg src='https://source.unsplash.com/random' alt='123' sx={{objectFit:'cover'}}/>
        </Grid>
        {/* Tittle */}
        <Grid item xs={12} marginTop={5} display="flex" flexDirection='row' alignItems="center" justifyContent={'space-between'}>
          <Box>
            <Typography fontSize={'2em'}>RECIPE NAME {`${info}`}</Typography>
            <Typography>This is discription</Typography>
          </Box>
          <Button startIcon={LikeState[0]?<ThumbUpAltIcon/>:<ThumbUpOffAltIcon/>} onClick={handleLike}>{`${LikeState[1]}`}</Button>
        </Grid>
        {/* avatar and subcrib */}
        <Grid item xs={12} marginTop={3} display="flex" flexDirection='row' alignItems="center" justifyContent={'space-between'}>
          <Box display="flex" flexDirection='row' alignItems="center">
            <Avatar src='https://source.unsplash.com/random' alt='123'/>
            <Typography fontSize={'1em'} margin='0 20px'>Contributor</Typography>
          </Box>
          <Button variant="outlined" onClick={handleSubcrib}>{SubcribState? 'unsubscrib':`subcrib`}</Button>
        </Grid>
        {/* tags */}
        <Grid item xs={12} marginTop={5}>
          <Typography fontSize={'2em'}>TAGS</Typography>
          <Box display={'flex'} flexWrap={'wrap'}>
            {tags.map((info, key) => (
              <Chip  color="primary" label={`#${info}`} clickable key={key} sx={{ margin:'10px'}}/>
            ))}
          </Box>
        </Grid>
        {/* ingredients */}
        <Grid item xs={12} marginTop={5}>
          <Typography fontSize={'2em'}>Ingredients</Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650, border:0 }} aria-label="simple table">
              <TableBody>
                {Ingredients.map((info, key)=>(
                  <TableRow
                    key={key}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {info.name}
                    </TableCell>
                    <TableCell align="center">{info.type}</TableCell>
                    <TableCell align="right">{`${info.calories} calories`}</TableCell>
                  </TableRow>
                ))}
                <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {'Total Calories'}
                    </TableCell>
                    <TableCell align="center">{`${sum(Ingredients)} calories`}</TableCell>
                    <TableCell align="right">
                      <SentimentVeryDissatisfiedIcon/>
                      {`Exceeded your target calories`}
                    </TableCell>
                  </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        {/* step */}
        <Grid item xs={12} marginTop={5}>
          <Typography fontSize={'2em'} sx={{marginBottom:'16px'}}>Recipe Step</Typography>
          <Stack spacing={2}>
            {RecipeStep.map((info,key) => (
              <Box key={key}>
                <Typography fontSize={'1.2em'}>STEP {key+1}/{RecipeStep.length}</Typography>
                <Box display={'flex'} flexDirection='row'>
                  <StepImg src={`${info.img}`} alt={'123'} sx={{objectFit:'cover'}}/>
                  <Typography sx={{paddingLeft:'1em'}}>{info.Description}</Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Grid>
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
              <Stack>
              {Recommendation.map((info, key) => (
                <Box key={key} marginTop={'20px'}>
                  <Box display={'flex'} flexDirection='row'>
                    <StepImg src={`${info.img}`} alt={'123'} sx={{objectFit:'cover'}}/>
                    <Typography sx={{paddingLeft:'1em'}}>{info.Description}</Typography>
                  </Box>
                </Box>
              ))}
              </Stack>
            </TabPanel>
            <TabPanel value={value} index={1}>
              {comments.map((info,key) => (
                <Box key={key} display='flex' flexDirection={'row'} alignContent='center' marginTop={1}>
                  <AccountCircle sx={{ color: 'action.active' }} />
                  <Typography key={key}>:{info.comment}</Typography>
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
      <ButtonGroup sx={{position:'fixed', right:'1em', bottom:'1em'}} orientation="vertical">
        <Button startIcon={LikeState[0]?<ThumbUpAltIcon/>:<ThumbUpOffAltIcon/>} onClick={handleLike}/>
        <Button startIcon={markState?<FavoriteIcon/>:<FavoriteBorderIcon/>} onClick={handleMark}/>
      </ButtonGroup>
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