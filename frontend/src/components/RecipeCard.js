import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import { CardMedia } from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function RecipeCard() {
  const StyledMedia = styled(CardMedia)(({theme}) => ({
    height:'30vmin',
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
      <CardActionArea onClick={() => navigate('RecipeDetail')}>
        <StyledMedia
          component="img"
          image="https://source.unsplash.com/random"
          alt="random"
        />
        </CardActionArea>
        <CardActions
          display='flex' justifycontent='space-between'
          sx={{
            position: 'absolute',
            bottom: 0,
            right:0,
            // background: 'linear-gradient(to top, #000, rgba(0,0,0,0))',
          }}
        >
          
          <Button
            startIcon={heartCdt? <FavoriteIcon/>:<FavoriteBorderIcon/>}
            size="small"
            onClick={hadleLike}
          />
          <Button
            startIcon={thumbCdt? <ThumbUpIcon/>:<ThumbUpOffAltIcon/>}
            size="small"
            onClick={handleThumb}
          />
        </CardActions>
    </Card>
  )
}
