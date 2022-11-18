import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Button, ButtonGroup, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Chip } from '@mui/material';
import Paper from '@mui/material/Paper';
// import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { Stack } from '@mui/system';
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
// import LunchDiningIcon from '@mui/icons-material/LunchDining';
import { useSnackbar } from "notistack";
import Header from '../components/Header';

const RecipeContent = ( {info} ) => {
  const { enqueueSnackbar } = useSnackbar();
  const [allInfo, setAllInfo] = React.useState('')
  React.useEffect(() => {
    const email = localStorage.getItem('email')
    !allInfo && callApi(`/recipe/details/${info}/${email ? email : '0'}`, 'GET')
      .then(data=>{
        console.log(data)
        setAllInfo(data.detail)
      })
      .catch(err => {console.log(err)})
  },[info, allInfo])
  const handleLike = () => {
    const email = localStorage.getItem('email') ? localStorage.getItem('email') : undefined
    if(email){
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
    }else{
      enqueueSnackbar('Please Login')
    }
    
  }
  const handleSubcrib = () => {
    const email = localStorage.getItem('email') ? localStorage.getItem('email') : undefined
    if(email){
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
    }else{
      enqueueSnackbar('Please Login')
    }
    
  }
  const [value, setValue] = React.useState(0)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  }
  // const [markState, setMark] = React.useState(allInfo['CollectionState'] ? allInfo['CollectionState'] : false)
  const handleMark = () => {
    const email = localStorage.getItem('email') ? localStorage.getItem('email') : undefined
    if(email){
      callApi(allInfo['CollectionState'] ? '/user_cancel_collection' :`/user_collection`, 'POST', {"user_email":localStorage.getItem('email'),"recipeid":info})
      .then(data => {
        console.log(data)
        var newData = JSON.parse(JSON.stringify(allInfo));
        newData.CollectionState = !newData.CollectionState
        setAllInfo(newData)
      })
      .catch(err => console.log(err))
    }else{
      enqueueSnackbar('Please Login')
    }
    
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
      const email = localStorage.getItem('email') ? localStorage.getItem('email') : undefined
      if(email){
        const avatar = localStorage.getItem('avatar')
        callApi(`/addcomment`, 'POST', {email ,"content":e.target.value,'recipeid':info})
          .then(data => {
            console.log(data)
            var newData = JSON.parse(JSON.stringify(allInfo));
            newData.comment = [...newData.comment, {avatar, 'userid': email, 'content': e.target.value, 'commentid':data.commentid}]
            setAllInfo(newData)
          })
          .catch(err => {
            console.log(err)
          })
      }else{
        enqueueSnackbar('Please Login')
      }
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
  const StyledButton = styled(Button) (({ theme}) => ({
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(',')
  }))
  const StyledThumbUpAltIcon = styled(ThumbUpAltIcon)(({theme}) => ({
    color:'#fc8bab'
  }))
  const StyledThumbUpOffAltIcon = styled(ThumbUpOffAltIcon)(({theme}) => ({
    color:'#fc8bab'
  }))
  const StyledButtonAlt = styled(Button)(({ theme }) => ({
    border:'1px solid #fc8bab',
    color:'#fc8bab',
    '&:hover': {
      border:'1px solid #fc8bab',
      color:'#fc8bab'
    }
  }))
  const StyledImg = styled('img') (({ theme }) => ({
    height:'50px',
    width:'50px',
    objectFit:'cover'
  }))
  const NoDisplayImgSrc = `http://${window.location.hostname}:${window.location.port}/upload_Holder.png`
  return(
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ marginTop:'64px', width:'100%'}}>
      <Grid container width='700px' marginTop={12}>
        {/* image */}
        {(allInfo.cover && allInfo.cover!== NoDisplayImgSrc && allInfo.cover!=='') &&
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
          {(allInfo.author !== localStorage.getItem('email')) && 
          <Button startIcon={allInfo['likeState']?<StyledThumbUpAltIcon/>:<StyledThumbUpOffAltIcon/>} onClick={handleLike} sx={{color:'#fc8bab'}}>
            {`${allInfo['likeCount']}`}
            </Button>}
        </Grid>
        {/* avatar and subcrib */}
        <Grid item xs={12} marginTop={3} display="flex" flexDirection='row' alignItems="center" justifyContent={'space-between'}>
          <Box display="flex" flexDirection='row' alignItems="center">
            <Avatar src={allInfo.author_avatar ? allInfo.author_avatar : 'https://source.unsplash.com/random'} alt='123'/>
            <Typography fontSize={'1em'} margin='0 20px'>{allInfo.author_name ? allInfo.author_name : 'uploader'}</Typography>
          </Box>
          {(allInfo.author !== localStorage.getItem('email')) && <StyledButton variant="outlined" color='success' onClick={handleSubcrib}>{allInfo.subscribeState? 'unsubscribe':`subcribe`}</StyledButton>}
        </Grid>
        {/* tags */}
        <Grid item xs={12} marginTop={5}>
          <Typography fontSize={'2em'}>TAGS</Typography>
          <Box display={'flex'} flexWrap={'wrap'}>
            {(allInfo && allInfo.category )&& (allInfo.category).map((info, key) => (
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
                {allInfo.ingredients && (allInfo.ingredients).map((info, key)=>(
                  <TableRow
                    key={key}
                    sx={{ '&:last-child td, &:last-child td': { border: 0 } }}
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
                      <Typography sx={{color:'green'}}>
                        {'Total Calories'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{color:'green'}}>{allInfo.calories ? allInfo.calories :`unknown`}{'  kcal'}</TableCell>
                    <TableCell align="right" sx={{width:'33%'}}>
                      <StyledImg src="/kcal.jpg" alt='kcal'/>
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
                {(allInfo.stepImage_list && (allInfo.stepImage_list[key] !== NoDisplayImgSrc) && allInfo.stepImage_list[key]!== '')
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
                <Grid item xs={6}key={key}>
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
                    <Typography>&nbsp;{info.username ? info.username : info.userid}&nbsp;</Typography>
                    <Typography key={key}>:&nbsp;&nbsp;{info.content}</Typography>
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
          <StyledButtonAlt color='success' endIcon={allInfo['likeState']?<StyledThumbUpAltIcon/>:<StyledThumbUpOffAltIcon/>} onClick={handleLike}>
            Like
          </StyledButtonAlt>
          <StyledButtonAlt color='success' endIcon={allInfo.CollectionState ?<FavoriteIcon/>:<FavoriteBorderIcon/>} onClick={handleMark}>
            Favorite
          </StyledButtonAlt>
        </ButtonGroup>
        :<ButtonGroup sx={{position:'fixed', right:'1em', bottom:'1em'}} orientation="vertical">
          <Tooltip title='edit'><Button color='success' startIcon={<EditIcon/>} onClick={() => navigate(`/recipeEdit/${info}`)}/></Tooltip>
          <Tooltip title='delete'><Button color='success' startIcon={<DeleteForever/>} onClick={handleDelete}/></Tooltip>
        </ButtonGroup>
        }
    </Box>
  );
}

export default function RecipeDetail() {
  const param = useParams();

  return(<>
  <Header Htype={1}/>
  <RecipeContent info={param.id}/>
  </>);
}