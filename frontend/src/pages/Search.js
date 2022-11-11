import * as React from 'react';
import { Box, Grid, Card, Button, Link } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import Header from '../components/Header';
import { callApi } from '../components/FunctionCollect';

function Body({searchInfo}){
  const [recipeList, setList] = React.useState({
    'List':undefined,
    'Pool':undefined
  })
  React.useEffect(() => {
    console.log(searchInfo)
    console.log(recipeList['aim'])

    if(!recipeList['List']){
      callApi('/search', 'POST', searchInfo)
        .then(data => {
          console.log(data)
          setList({
            'List':[...data['RecipeId']],
            'Pool':undefined
          })
        })
        .catch(err => console.log(err))
    }
    if(recipeList['List'] && !recipeList['Pool']){
      const newPool = recipeList['List'].slice(0,16)
      setList({
        'List':[...recipeList['List']],
        'Pool':newPool
      })
    }
    const scrollListen = () =>{
      var scrollTopHeight = document.body.scrollTop || document.documentElement.scrollTop
      var showHeight = window.innerHeight
      var allHeight = document.body.scrollHeight
      if ((allHeight + 99 < scrollTopHeight + showHeight) && recipeList['List']){
        const newPool = recipeList['List'].slice(0,recipeList['Pool'].length+16)
        setList({
          'List':[...recipeList['List']],
          'Pool':newPool
        })
      }
    }
    window.addEventListener("scroll", scrollListen)
    return () => {
      window.removeEventListener("scroll", scrollListen)
    }
  },[recipeList, searchInfo])
  const [orderBy, setOrder] = React.useState(true)
  function handleChangeOrder(){
    setOrder(!orderBy)
  }
  return(
    <Box sx={{marginTop:'100px', display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center'}}>
      <Grid container spacing={2} width={'85vw'}>
        <Grid item xs={12}>
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
        </Grid>
        {recipeList['Pool'] && recipeList['Pool'].map((info, index) => (
          <Grid item sm={6} md={4} lg={3} key={index}>
            <RecipeCard info={info}/>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default function SearchResult() {
  const param = useParams()
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
  const searchInfo = {
    'method':param.method,
    'data': (param.info === 'searchImg' ? localStorage.getItem('searchImg') :param.info),
    'topk':60
  }
  return(
    <Box>
      <Header Htype={1}/>
      <Body searchInfo={searchInfo}/>
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
    </Box>
  )
}
