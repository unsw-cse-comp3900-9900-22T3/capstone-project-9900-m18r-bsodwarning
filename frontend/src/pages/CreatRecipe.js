import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Button, Grid , TextField, IconButton } from '@mui/material';
import { Stack } from '@mui/system';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import ClearIcon from '@mui/icons-material/Clear';

const StyledInput = styled('input')(({theme}) => ({
  display:'none'
}))//hidden input

const StyledImg = styled('img')(({theme}) => ({
  objectFit:'cover',
  width:'100%',
  height:'100%',
  borderRadius:'10px'
}))

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
const RecipeContent = ( ) => {

  const [coverImg, setCover] = React.useState('')

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      name:data.get('name'),
      discription:data.get('discription'),
      ingredient:data.getAll('ingredient'),
      amount:data.getAll('amount')
    })
  }
  const handleEdit = () => {
    document.getElementById('file').click()
  }//triger of file input
  const handleBrowse = (e) => {
    const data = e.target.files[0]
    var reader = new FileReader()
    reader.addEventListener("load", function() {
      setCover(reader.result)
    }, false)
    reader.readAsDataURL(data)
  }
  function BasicPart() {
    return(
      <Grid item xs={12}>
        <Typography fontSize={'3em'}>Basics</Typography>
        <Stack sx={{ margin:'64px 10% 0 10%'}} spacing={2}>
          {/* name */}
          <Typography>NAME YOUR RECIPE</Typography>
          <TextField margin="normal" required autoFocus id='name' name='name' />
          {/* photo */}
          <Typography>ADD PHOTO</Typography>
          <Box display={'flex'} flexDirection='row' alignItems={'center'} justifyContent='space-between'>
            <Box sx={{position:'relative', width:'380px', height:'260px', border:'1px solid black', borderRadius:'10px'}}>
              {!coverImg
                ?<StyledImg src={'/upload_Holder.png'} alt='402'/>
                :<StyledImg src={coverImg} alt='404'/>
              }
              <IconButton color='primary' onClick={handleEdit} sx={{position:'absolute', right:'10px', bottom:'10px'}}>
                <ModeEditIcon/>
              </IconButton>
              <StyledInput accept='image/jpeg' type={'file'} id="file" name="file" onChange={e => handleBrowse(e)}/>
            </Box>
            <Typography align='center' sx={{margin:'20px'}}>Image must be original personal photos,in jpg format</Typography>
          </Box>
          {/* ADD DESCRIPTION */}
          <Typography>ADD DESCRIPTION</Typography>
          <TextField margin="normal" required autoFocus  id='discription' name='discription' />
          {/* Tag */}
          <Typography>ADD Tags</Typography>
          <TextField margin="normal" required autoFocus  id='tags' name='tags' label={'E.g. Breakfast, Main, Beverage, Chinese, European'}/>
        </Stack>
      </Grid>
    )
  }

  
  function IngredientPart() {
    const [ingredient, setIngredient] = React.useState([''])
    const handleAddIngredient = () => {
      setIngredient([...ingredient, ''])
    }
    const handleDeleteIngredient = (prop) => {
      var newIngre = [...ingredient]
      newIngre.splice(prop, 1)
      setIngredient(newIngre)
    }
    return(
      <Grid item xs={12}>
        <Typography fontSize={'3em'}>Ingredient</Typography>
        <Stack sx={{ margin:'64px 10% 0 10%'}} spacing={2}>
          <Box sx={{width:'100%',display:'flex', flexDirection:'row', }}>
            <Typography width='40%'>INGREDIENT</Typography>
            <Typography width='40%'>AMOUNT</Typography>
          </Box>
          {ingredient.map((info,index) => (
            <Box key={index} sx={{width:'100%',display:'flex', flexDirection:'row', }}>
              <TextField
              sx={{width:'40%'}} 
              label='E.g. Chicken fillet' 
              id={`ingredient`}
              name={`ingredient`}
              />
              <TextField 
              sx={{width:'40%'}} 
              label='E.g. 400 grams' 
              id={`amount`}
              name={`amount`}
              />
              <IconButton sx={{marginLeft:'10px'}} onClick={() => handleDeleteIngredient(index)}>
                <ClearIcon/>
              </IconButton>
            </Box>
          ))}
          
          <Box
            component={'button'}
            type={'button'}
            sx={{ border:'1px solic black' , 
                  width:'80%', 
                  height:'40px', 
                  display:'flex', 
                  flexDirection:'row', 
                  alignItems:'center', 
                  justifyContent:'center',
                  backgroundColor:'white',
                  cursor: "pointer"
                }}
            onClick={handleAddIngredient}
            >
            <ControlPointIcon/>
            <Typography>ADD ONE MORE INGREDIENT</Typography>
          </Box>
        </Stack>
      </Grid>
    )
  }

  return(
    <Box component="form" onSubmit={handleSubmit} noValidate display="flex" justifyContent="center" alignItems="center" sx={{ marginTop:'64px', width:'100%'}}>
      <Grid container width='1000px' marginTop={12} spacing={2}>
        <BasicPart/>
        <IngredientPart/>
        <Grid item xs={12}>
          <Button type="submit" variant="contained">
            submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default function CreatRecipe() {
  const param = useParams();

  return(<>
  <Header/>
  <RecipeContent info={param.id}/>
  </>);
}