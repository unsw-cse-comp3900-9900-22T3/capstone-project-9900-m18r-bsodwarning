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
import './RecipeCard.css'
export default function RecipeCard( {info} ) {
  const StyledMedia = styled(CardMedia)(({theme}) => ({
    height:'30vmin',
    minHeight:'20em',
    objectFit:'cover'
  }));
  const [heartCdt, setheart] = React.useState(false)
  const [thumbCdt, setthumb] = React.useState(false)
  const hadleLike = () => {
    setheart(!heartCdt)
  }
  const handleThumb = () => {
    setthumb(!thumbCdt)
  }

  const navigate = useNavigate();
  return (
    <Card
      sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }}
    >
      <CardActionArea onClick={() => {navigate(`/RecipeDetail/${info}`)}}>
        <StyledMedia
          component="img"
          image="https://source.unsplash.com/random"
          alt="random"
        />
        </CardActionArea>
        <CardActions>
          <Box sx={{display:'flex', justifyContent:'space-between', width:'100%'}}>
            <Typography marginLeft={'10px'}>Tittle</Typography>
            <Box>
              <Button
                id='favorbutton'
                startIcon={heartCdt? <FavoriteIcon/>:<FavoriteBorderIcon/>}
                size="small"
                onClick={hadleLike}
              />
              <Button
                id='thunbbutton'
                startIcon={thumbCdt? <ThumbUpIcon/>:<ThumbUpOffAltIcon/>}
                size="small"
                onClick={handleThumb}
              />
            </Box>
          </Box>
        </CardActions>
    </Card>
  )
}
