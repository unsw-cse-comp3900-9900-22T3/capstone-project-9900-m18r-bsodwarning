import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import { Button, CardMedia, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { CardActionArea, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { callApi } from './FunctionCollect';
import { useSnackbar } from "notistack";
import Skeleton from '@mui/material/Skeleton';

export default function RecipeCard( {info} ) {
  const [cardInfo, setCard] = React.useState()
  const email = localStorage.getItem('email')
  const { enqueueSnackbar } = useSnackbar();
  React.useEffect(()=>{
    callApi(`/recipe/card/${info}/${email ? email : '0'}`, 'GET')
      .then(data => {
        // console.log(data)
        setCard(data)
      })
  },[info, email])
  const StyledMedia = styled(CardMedia)(({theme}) => ({
    height:'30vmin',
    minHeight:'20em',
    objectFit:'cover'
  }));
  // like => favorite
  const hadleLike = () => {
    const email = localStorage.getItem('email') ? localStorage.getItem('email') : undefined
    if(email){
      callApi(cardInfo['iscollected'] ? '/user_cancel_collection' :`/user_collection`, 'POST', {"user_email":localStorage.getItem('email'),"recipeid":info})
      .then(data => {
        console.log(data)
        var newData = JSON.parse(JSON.stringify(cardInfo));
        if(newData['iscollected']){
          newData['collection_count'] = newData['collection_count'] - 1
        }else{
          newData['collection_count'] = newData['collection_count'] + 1
        }
        newData['iscollected'] = !newData['iscollected']
        setCard(newData)
      })
      .catch(err => console.log(err))
    }else{
      enqueueSnackbar('Please Login')
    }
    
  }
  // Thumb => like
  const handleThumb = () => {
    const email = localStorage.getItem('email') ? localStorage.getItem('email') : undefined
    if(email){
      callApi(cardInfo['isliked']?'/user_cancel_like' : `/user_like`, 'POST', {"user_email":localStorage.getItem('email'),"recipeid":info})
      .then(data => {
        console.log(data)
        var newData = JSON.parse(JSON.stringify(cardInfo));
        if(newData['isliked']){
          newData['like_count'] = newData['like_count'] - 1
        }else{
          newData['like_count'] = newData['like_count'] + 1
        }
        newData['isliked'] = !newData['isliked']
        
        setCard(newData)
      })
      .catch(err => console.log(err))
    }else{
      enqueueSnackbar('Please Login')
    }
    
  }

  const navigate = useNavigate();
  const FormatDate = (input) => {
    const thisDate = new Date(input)
    return `${thisDate.getHours()}:${thisDate.getMinutes()}:${thisDate.getSeconds()} ${thisDate.getDate()}/${thisDate.getMonth()+1}/${thisDate.getFullYear()}`
  }
  return (
    <Card
      sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }}
    >
      <CardActionArea onClick={() => {navigate(`/RecipeDetail/${info}`); window.location.reload()}}>
        {cardInfo
        ?<StyledMedia
            component="img"
            image={(cardInfo.cover && cardInfo.cover!=='http://localhost:3000/upload_Holder.png')?cardInfo.cover :'/null.jpg'}
            alt="not found"
          />
        :<Skeleton height={'30vmin'}/>
        }
        
        </CardActionArea>
        <CardActions>
          <Box sx={{display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center', flexDirection:'row'}}>
            <Box sx={{display:'flex', flexDirection:'column',marginLeft:'10px', width:'60%'}}>
              {cardInfo ? <Typography noWrap={true} >{cardInfo.tittle}</Typography> : <Skeleton width={'60%'}/>}
              {cardInfo ? <Typography noWrap={true} sx={{fontStyle:'italic'}}>{FormatDate(cardInfo.create_time)}</Typography> : <Skeleton width={'60%'}/>}
            </Box>
            <Box sx={{display:'flex', flexDirection:'column'}}>
              {/* <IconButton size="small" sx={{color:'#fc8bab'}} onClick={hadleLike}>
                {(cardInfo && cardInfo['iscollected'])? <FavoriteIcon fontSize="small"/>:<FavoriteBorderIcon fontSize="small"/>}
              </IconButton> */}
              <Button
              startIcon={(cardInfo && cardInfo['isliked'])? <ThumbUpIcon fontSize="small"/>:<ThumbUpOffAltIcon fontSize="small"/>}
              size="small" sx={{color:'#fc8bab'}}
              onClick={handleThumb}
              >
                {cardInfo && cardInfo.like_count}
              </Button>
              <Button
              startIcon={(cardInfo && cardInfo['iscollected'])? <FavoriteIcon fontSize="small"/>:<FavoriteBorderIcon fontSize="small"/>}
              size="small" sx={{color:'#fc8bab'}}
              onClick={hadleLike}
              >
                {cardInfo && cardInfo.collection_count}
              </Button>
              {/* <IconButton size="small" sx={{color:'#fc8bab'}} onClick={handleThumb}>
                {(cardInfo && cardInfo['isliked'])? <ThumbUpIcon fontSize="small"/>:<ThumbUpOffAltIcon fontSize="small"/>}
              </IconButton> */}
            </Box>
          </Box>
        </CardActions>
    </Card>
  )
}
