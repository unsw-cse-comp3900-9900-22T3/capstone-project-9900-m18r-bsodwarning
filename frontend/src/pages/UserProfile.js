import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { Button,ButtonGroup,Chip,Grid, TextField, Autocomplete, IconButton, Tooltip, Typography, Box, Stack } from '@mui/material';
import RecipeCard from '../components/RecipeCard';
import FeedIcon from '@mui/icons-material/Feed';
import KeyIcon from '@mui/icons-material/Key';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { callApi } from '../components/FunctionCollect';
import { useSnackbar } from "notistack";
import Header from '../components/Header';

const ProfileContent = ({props}) => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const myinfo = {
    'username':'',
    'avatar':'',
    'email': '',
    'gender': '',
    'age': '',
    'Height': '',
    'weight': '',
    'level': '',
    'time': '',
    'preference': [],
    'allergies': []
  }
  const [userInfo, setInfo] = React.useState(myinfo)
  const email = props
  React.useEffect(() => {
    callApi(`/profile/query/${email}`, 'GET')
      .then(data => {
        console.log(data)
        localStorage.setItem('avatar', data.profile.avatar)
        setInfo(data.profile)
      })
      .catch(err => {
        console.log(err)
        navigate('/')
      })
  },[email,navigate])
  
  const [page, setPage] = React.useState(true)
  const switchPage = () => {
    setPage(!page)
  }
  const [window, setWindow] = React.useState(true)
  const switchWindow = () => {
    setWindow(!window)
  }
  // const published = ['1','2','3','4']
  // const favorites = ['1', '2','3','4','5','6']
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
              ? <Button disabled variant="contained" color='warning' sx={{marginRight:'30px'}}>Published Recipes {userInfo['post']? userInfo['post'].length : ''}</Button>
              : <Button onClick={switchWindow} variant="contained" color='warning' sx={{marginRight:'30px'}}>Published Recipes {userInfo['post']? userInfo['post'].length : ''}</Button>
            }
            {window
              ? <Button onClick={switchWindow} variant="contained" color='secondary'>Favorite Recipes {userInfo['collection_list'] ? userInfo['collection_list'].length : 0}</Button>
              : <Button disabled variant="contained" color='secondary'>Favorite Recipes {userInfo['collection_list'] ? userInfo['collection_list'].length :0}</Button>
            }
          </Box>
          <Grid container spacing={4}>
            {window
              ? userInfo['post'] && userInfo['post'].map((info, key) => (
                  <Grid item key={key} xs={6}>
                    <RecipeCard info={info} />
                  </Grid>
                ))
              : userInfo['collection_list'] && userInfo['collection_list'].map((info,key) => (
                  <Grid item key={key} xs={6}>
                    <RecipeCard info={info} />
                  </Grid>
                ))
            }
          </Grid>
        </Grid>
    )
  }
  const [preference, setPre] = React.useState()
  const [avoid, setAvoid] = React.useState()
  const InfoDisplay = () => {
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
    function handlePreference(value){
      setPre(value)
    }
    function handleAvoid(value){
      setAvoid(value)
    }
    const selectList = [
      'egg','beef','lamb','pork','oil'
    ]
    return(
      <Grid item xs={12} sx={{marginTop:'20px'}}>
        <Stack>
          <Typography fontSize={'2em'}>Basic Info</Typography>
          <StyledBox>
            <Typography>User Name</Typography>
            <Box width={'50%'}>
              <TextField id='name' name='name' size='small' defaultValue={userInfo.username} fullWidth/>
            </Box>
          </StyledBox>
          <StyledBox>
            <Typography>Email</Typography>
            <Box width={'50%'}>
              <TextField id='email' name='email' size='small' defaultValue={userInfo.email} fullWidth/>
            </Box>
          </StyledBox>
          <StyledBox>
            <ItemBox>
              <Typography>Gender</Typography>
              <TextField id='gender' name='gender' size='small' defaultValue={userInfo.gender}/>
            </ItemBox>
            <ItemBox>
              <Typography>Age</Typography>
              <TextField id='age' name='age' size='small' defaultValue={userInfo.age}/>
            </ItemBox>
          </StyledBox>
          <StyledBox>
            <ItemBox>
              <Typography>Height(cm)</Typography>
              <TextField id='Height' name='Height' size='small' defaultValue={userInfo['height']&&`${userInfo['height']}`}/>
            </ItemBox>
            <ItemBox>
              <Typography>Weight(kg)</Typography>
              <TextField id='weight' name='weight' size='small' defaultValue={userInfo.weight&&`${userInfo.weight}`}/>
            </ItemBox>
          </StyledBox>
          <StyledBox>
            <ItemBox>
              <Typography>Cooking Level</Typography>
              <TextField id='level' name='level' size='small' defaultValue={userInfo.level}/>
            </ItemBox>
          </StyledBox>
          <StyledBox>
            <Typography>The time you are willing to spend on cooking per meal</Typography>
            <TextField id='time' name='time' size='small' defaultValue={userInfo.time&&`${userInfo.time}h`}/>
          </StyledBox>
          <Box>
            <Typography sx={{marginTop:'20px'}}>Preference</Typography>
            <Box sx={{display:'flex', flexDirection:'row', flexWrap:'wrap', alignItems:'center'}}>
              {userInfo &&
              <Autocomplete
                multiple
                id="preference"
                options={selectList}
                defaultValue={preference ? preference :userInfo['preference']}
                freeSolo
                fullWidth
                onChange={(e,value, createOption) => handlePreference(value)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="filled"
                    placeholder="Type or select to add"
                  />
                )}
              />}
            </Box>
          </Box>
          <Box>
            <Typography sx={{marginTop:'20px'}}>Allergic or disliked foods to avoid</Typography>
            <Box sx={{display:'flex', flexDirection:'row', flexWrap:'wrap', alignItems:'center'}}>
              {userInfo &&
                <Autocomplete
                  multiple
                  id="Avoid"
                  options={selectList}
                  defaultValue={avoid ? avoid :userInfo['allergies']}
                  freeSolo
                  fullWidth
                  onChange={(e,value, createOption) => handleAvoid(value)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="filled"
                      placeholder="Type or select to add"
                    />
                  )}
                />}
            </Box>
          </Box>
          <ButtonGroup sx={{ width:'100%', display:'flex', justifyContent:'space-around', marginTop:'40px'}}>
            <Button variant='contained' color='success' type="submit">Save Change</Button>
          </ButtonGroup>
        </Stack>
      </Grid>
    )
  }
  const StyledInput = styled('input')(({theme}) => ({
    display:'none'
  }))//hidden input
  const handleEdit = () => {
    document.getElementById('IMGfile').click()
  }//triger of file input
  const handleBrowse = (e) => {
    const data = e.target.files[0]
    var reader = new FileReader()
    reader.addEventListener("load", function() {
      const newInfo = {...userInfo}
      console.log(newInfo)
      newInfo['avatar'] = reader.result
      setInfo(newInfo)
    }, false)
    reader.readAsDataURL(data)
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const info = {
      username: data.get('name'),
      email: data.get('email'),
      gender: data.get('gender'),
      age: data.get('age'),
      height: data.get('Height'),
      weight: data.get('weight'),
      level: data.get('level'),
      time: data.get('time'),
      preference,
      allergies:avoid,
      avatar:userInfo['avatar']
    }
    console.log(info)
    callApi('/profile/alter', 'POST', info)
      .then(data => {
        enqueueSnackbar(data.msg, { variant:'success'})
      })
      .catch(err => {
        enqueueSnackbar(err)
      })
  }
  return(
    <Box component={'form'} onSubmit={handleSubmit} display="flex" justifyContent="center" alignItems="center" sx={{ margin:'110px 0', width:'100%'}}>
      <Grid container marginTop={12} sx={{ border:'2px solid #c9f980',width:'964px', borderRadius:'5px', padding:'20px 30px'}}>
        <Grid item xs={12} sx={{borderBottom:'2px silid black'}}>
          <Box display="flex" flexDirection={'row'} alignItems='center' justifyContent={'space-between'} sx={{ borderBottom:'2px solid black', paddingBottom:'20px'}}>
            <Box position={'relative'}>
              {!userInfo.avatar
                ?<HeadImg src={'/upload_Holder.png'} alt='402'/>
                :<HeadImg src={userInfo.avatar} alt='404'/>
              }
              {!page &&
                <IconButton color='primary' onClick={handleEdit} sx={{position:'absolute', right:'10px', bottom:'10px'}}>
                  <ModeEditIcon/>
                </IconButton>
              }
              
              <StyledInput accept='image/jpeg' type={'file'} id="IMGfile" name="IMGfile" onChange={e => handleBrowse(e)}/>
            </Box>
            <Typography fontSize={'3em'} height='1.5em' >
              {page
                ?`Hi,${userInfo.username}! ^_^`
                : `${userInfo.username}`
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
  const param = useParams();
  return(
    <>
      <Header Htype={1}/>
      <ProfileContent props={param.email}/>
    </>
  )
}
