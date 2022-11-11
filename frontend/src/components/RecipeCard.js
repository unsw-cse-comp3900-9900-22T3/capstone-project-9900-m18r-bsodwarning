import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import { CardMedia, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { CardActionArea, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { callApi } from './FunctionCollect';
import Skeleton from '@mui/material/Skeleton';

export default function RecipeCard( {info} ) {
  const [cardInfo, setCard] = React.useState('')
  React.useEffect(()=>{
    callApi(`/recipe/card/${info}`, 'GET')
      .then(data => {
        setCard(data)
      })
  },[info])
  const StyledMedia = styled(CardMedia)(({theme}) => ({
    height:'30vmin',
    minHeight:'20em',
    objectFit:'cover'
  }));
  const hadleLike = () => {
    callApi(cardInfo['iscollected'] ? '/user_cancel_collection' :`/user_collection`, 'POST', {"user_email":localStorage.getItem('email'),"recipeid":info})
      .then(data => {
        console.log(data)
        var newData = JSON.parse(JSON.stringify(cardInfo));
        newData['iscollected'] = !newData['iscollected']
        setCard(newData)
      })
      .catch(err => console.log(err))
  }
  const handleThumb = () => {
    callApi(cardInfo['isliked']?'/user_cancel_like' : `/user_like`, 'POST', {"user_email":localStorage.getItem('email'),"recipeid":info})
      .then(data => {
        console.log(data)
        var newData = JSON.parse(JSON.stringify(cardInfo));
        newData['isliked'] = !newData['isliked']
        setCard(newData)
      })
      .catch(err => console.log(err))
  }

  const navigate = useNavigate();
  return (
    <Card
      sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }}
    >
      <CardActionArea onClick={() => {navigate(`/RecipeDetail/${info}`)}}>
        {cardInfo.cover
          ?<StyledMedia
            component="img"
            image={cardInfo.cover?cardInfo.cover :'/upload_Holder.png'}
            alt="not found"
          />
          : <Skeleton height='30vmin'/>
        }
        
        </CardActionArea>
        <CardActions>
          <Box sx={{display:'flex', justifyContent:'space-between', width:'100%'}}>
            {cardInfo ? <Typography marginLeft={'10px'}>{cardInfo.tittle}</Typography> : <Skeleton width={'60%'}/>}
            <Box>
              <Button
                startIcon={cardInfo['iscollected']? <FavoriteIcon/>:<FavoriteBorderIcon/>}
                size="small"
                onClick={hadleLike}
              />
              <Button
                startIcon={cardInfo['isliked']? <ThumbUpIcon/>:<ThumbUpOffAltIcon/>}
                size="small"
                onClick={handleThumb}
              />
            </Box>
          </Box>
        </CardActions>
    </Card>
  )
}
