import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import RecipeCard from '../components/RecipeCard';
import { Grid, Button, ButtonGroup } from '@mui/material';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuList from '@mui/material/MenuList';
import { callApi } from '../components/FunctionCollect';
import Header from '../components/Header';

const RecipeDisplay = () => {
  const [cardId, setCardId] = React.useState([])
  const navigate = useNavigate()
  const adImg = React.useRef({
    "cover":'https://www.allrecipes.com/thmb/VwULr05JFDluPI78PyLSZ8wrFgY=/2000x2000/smart/filters:no_upscale()/4511555-dessert-crepes-Buckwheat-Queen-1x1-1-90b5c7ed132f47728b8a2fdc1c984dd0.jpg',
    "id":undefined
    })
  React.useEffect(() => {
    callApi('/home', 'GET')
      .then(data => {
        console.log(data)
        adImg.current = data.advertisement
        setCardId(data.RecipeId)
      })
      .catch(err => {console.log(err)})
  },[])
  const Advertisement = () => {
    const wdt = document.documentElement.clientWidth * 0.2 + 'px';
    const StyledImg = styled('img')(({theme}) => ({
      width:'57vw',
      height:wdt,
      objectFit:'cover',
      component:'button'
    }));
    const StyledBox = styled(Box)(({theme}) => ({
      width:'43vw',
    }))
    const this_style = ({
      display:'flex',
      flexdirection:'row',
      marginTop:'68px'
    })
    return(
      <Box style={this_style}>
        <StyledImg
        src={adImg.current.cover}
        alt='nothing'
        onClick={e => {adImg.current.id ? navigate(`/RecipeDetail/${adImg.current.id}`) : console.log('waiting')}}
        />
        <StyledBox display="flex" justifyContent="center" alignItems="center">
          <Typography variant="overline" fontSize={20}>
          Cooking with Elegance<br/>Join us!
          </Typography>
        </StyledBox>
      </Box>
    );
  }
  const guide = {
    'Day Time':['Breakfast', 'Lunch', 'Dinner', 'Snacks'],
    'Diet':['Low Carb Recipes', 'Vegatarian Dishes', 'Vegan Dishes'],
    'Dish Type':['Meat', 'Fish', 'Chicken', 'Soup', 'Salad', 'Dessert'],
    'International':['Asian', 'Chinese', 'French', 'Japanese', 'Indian', 'Italian', 'Spanish'],
    'Occation':['Easy', 'Quick', 'Kids', 'Party', 'Summer', 'Winter'],
    'Baking': ['Bread', 'Cookies', 'cake'],
    'Drink':['Juice', 'Smoothies', 'Tea', 'Cocktails']
  }
  const StyledMenuItem = styled(MenuItem)(({ theme}) => ({
    backgroundColor:'#F6FEEA',
    color:'F6FEEA'
  }))
  const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor:'#F6FEEA',
    color:'black',
    '&:hover': {
      backgroundColor: '#F6FEEA',
      color:'black'
    }
  }))
  const GuideBar = ({props}) => {
    const navigate=useNavigate()
    const options = guide[`${props}`]
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const handleClick = (option) => {
      console.info(`You clicked ${option}`);
      navigate(`/search/${option}/ingredients`)
    };

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }

      setOpen(false);
    };

    if(props === 'More'){
      return(
        <Button variant="contained">More</Button>
      )
    }else{
    return (
      <React.Fragment>
        <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
          <StyledButton onClick={handleToggle}>{props}</StyledButton>
          <StyledButton
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </StyledButton>
        </ButtonGroup>
        <Popper
          sx={{
            zIndex: 1,
          }}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu" autoFocusItem>
                    {options.map((option, index) => (
                      <StyledMenuItem
                        key={index}
                        onClick={() => handleClick(option)}
                      >
                        {option}
                      </StyledMenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </React.Fragment>
    );}
  }

  return (
    <React.Fragment>
      <Advertisement/>
      <Box sx={{ flexGrow:1, margin:6 }} display="flex" justifyContent="center" alignItems="center">
        <Grid container spacing={2} width={'85vw'}>
          <Grid item xs={12}>
            <Typography variant='h3' display="flex" justifyContent="center" alignItems="center">What do you want to cook?</Typography>
          </Grid>
          <Grid item xs={12} sx={{display:'flex', flexdirection:'row', justifyContent:'space-between', flexWrap:'wrap'}}>
            {Object.keys(guide).map((info, index) => (
              <GuideBar key={index} props={info}/>
            ))
            }
          </Grid>
          {cardId.map((info, index) => (
            <Grid item sm={6} md={4} lg={3} key={index}>
              <RecipeCard info={info}/>
            </Grid>
          ))}
        </Grid>
      </Box>
    </React.Fragment>
  );
}

const BottomInfo = () => {
  return (
    <Grid
      container
      spacing={2}
      marginLeft='15vw'
      marginRight='15vw'
      sx={{ width:'70vw'}}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Grid item>Contact us</Grid>
      <Divider orientation="vertical" flexItem/>
      <Grid item>Join us</Grid>
      <Divider orientation="vertical" flexItem/>
      <Grid item>Become a partner</Grid>
    </Grid>
  );
}

export default function Home() {
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
  return <>
  {/* Top */}
  <Header/>
  {/* main */}
  <RecipeDisplay />
  <BottomInfo />
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
  </>
}