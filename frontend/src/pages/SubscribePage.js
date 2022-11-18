import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
// import { useNavigate } from 'react-router-dom';
import { Button, Card, Grid, CardHeader, Avatar, CardContent,Link } from '@mui/material';
import { red } from '@mui/material/colors';
import { Stack } from '@mui/system';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
// import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import RecipeCard from '../components/RecipeCard'
import { callApi } from '../components/FunctionCollect';
import Header from '../components/Header';

function Body({info}) {
  // const navigate = useNavigate()
  const myInfo = info

  const style = {
    width: '100%',
    bgcolor: 'background.paper',
  }
  const [selectedPart, setPart] = React.useState({
    "s":'1',
    "List":[],
    'Pool':undefined,
    'order':true
  })
  function handleClickAvatar(prop) {
    const newPart = {
      's':'3',
      'List':[],
      'Pool':(myInfo.RecipeList).filter(item => item.uploader_email === prop),
      'order':selectedPart.order
    }
    console.log(newPart)
    setPart(newPart)
  }
  function handleChangeOrder(){
    setPart({
      "s":'1',
      "List":[],
      'Pool':undefined,
      'order':!selectedPart.order
    })
  }
  React.useEffect(() => {
    function orderAgain(inputList) {
      return inputList.sort((x,y) => {
        if(selectedPart.order){
          return (new Date(y['upload_time'])) - (new Date(x['upload_time']))
        }else{
          return y['like_count'] - x['like_count']
        }
      })
    }
    if((selectedPart['s'] === '1') && myInfo) {
      const newList = orderAgain(myInfo.RecipeList)
      const newPart = newList.slice(0, 5)
      setPart({
        "s":'2',
        "List":newPart,
        'Pool':undefined,
        'order':selectedPart.order
      })
    }else if((selectedPart['s'] === '3') && selectedPart['Pool']){
      const newList = orderAgain(selectedPart['Pool'])
      const newPart = newList.slice(0, 5)
      setPart({
        "s":'2',
        "List":newPart,
        'Pool':newList,
        'order':selectedPart.order
      })
    }
    const scrollListen = () => {
      var scrollTopHeight = document.body.scrollTop || document.documentElement.scrollTop
      var showHeight = window.innerHeight
      var allHeight = document.body.scrollHeight
      if (allHeight + 50 < scrollTopHeight + showHeight) {
        if(selectedPart['s'] === '2'){
          if(selectedPart['Pool']){
            const newPart = orderAgain(selectedPart['Pool'].slice(0, selectedPart['List'].length+5))
            setPart({
              "s":'2',
              "List":newPart,
              'Pool':[...selectedPart['Pool']],
              'order':selectedPart.order
            })
          }else{
            const newList = orderAgain(myInfo.RecipeList)
            const newPart = newList.slice(0, selectedPart['List'].length+5)
            setPart({
              "s":'2',
              "List":newPart,
              'Pool':undefined,
              'order':selectedPart.order
            })
          }
          
        } 
      }
    }
    window.addEventListener("scroll", scrollListen)
    return () => window.removeEventListener("scroll", scrollListen)
  }, [selectedPart, myInfo])
  const handleUnSubscribe = (author) => {
    const email=localStorage.getItem('email')
    callApi('/user_cancel_subscribe', 'POST',{"user_email":email,"subscribed_email":author})
      .then(data => {
        console.log(data)
        window.location.reload()
      })
      .catch(err => {
        console.log(err)
      })
  }
  return(
    <Box sx={{marginTop:'100px', width:'100%', display:'flex', justifyContent:'center', minWidth:'1000px'}}>
      <Grid container sx={{width:'95%'}} spacing={5}>
        {/* User Info */}
        <Grid item xs={4}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
                        {/* <IconButton>
                          <DensitySmallIcon/>
                        </IconButton> */}
                        <Button onClick={e => handleUnSubscribe(info.email)}>
                          unsubscribe
                        </Button>
                      </Box>
                      {index === (myInfo.follow.length-1) ?<></> :<Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        {/* Recipe */}
        <Grid item xs={8}>
          <Stack spacing={2}>
            <Card>
              {selectedPart.order
                ?<Button disabled color='warning'>By time</Button>
                :<Button onClick={handleChangeOrder} color='warning'>By time</Button>
              }
              {selectedPart.order
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
      <Header Htype={1}/>
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
