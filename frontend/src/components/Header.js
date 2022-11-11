import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { AppBar, Box, Toolbar, Typography, InputBase, Tooltip, IconButton, Avatar, Menu, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from "notistack";
import ExploreIcon from '@mui/icons-material/Explore';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

export default function Header ({Htype}) {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar();
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
  const [method, setMethod] = React.useState('title');
  const handleChange = (event) => {
    setMethod(event.target.value);
  };
  const [email, setEmail] = React.useState('')
  const avatar = localStorage.getItem('avatar')
  React.useEffect(() => {
    setEmail(localStorage.getItem('email'))
  },[])
  const handleSearch = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget);
    navigate(`/search/${data.get('searchInfo')}/${method}`)
    window.location.reload()
  }
  const StyledInput = styled('input')(({theme}) => ({
    display:'none'
  }))//hidden input
  const handleEdit = () => {
    document.getElementById('file').click()
  }//triger of file input
  const handleBrowse = (e) => {
    const data = e.target.files[0]
    var searchImg = ''
    var reader = new FileReader()
    reader.addEventListener("load", function() {
      searchImg = reader.result
      console.log(searchImg)
      localStorage.setItem('searchImg',searchImg)
      navigate(`/search/searchImg/image`)
    }, false)
    reader.readAsDataURL(data)
  }
  return(
    <Box sx={{ flexGrow: 1, position: 'fixed', left:0, right:0, top:0, zIndex:1 }}>
      <AppBar position="static">
        <Toolbar>
          {(Htype && Htype === 1)
            && <IconButton onClick={() => navigate('/')}>
              <ChevronLeftIcon/>
            </IconButton>
          }
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Taste studio
          </Typography>
          {email &&
          <IconButton onClick={e => navigate('/subscribe')}>
            <ExploreIcon/>
          </IconButton>}
          <FormControl size="small">
              <InputLabel id="demo-simple-select-label">method</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={method}
                label="method"
                onChange={handleChange}
              >
                <MenuItem value={'title'}>Recipe Name</MenuItem>
                <MenuItem value={'ingredients'}>Ingredient</MenuItem>
              </Select>
            </FormControl>
          <Search>
            <Box  component='form' onSubmit={handleSearch}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder= 'search'
                inputProps={{ 'aria-label': 'search' }}
                name='searchInfo'
              />
              <Tooltip title='search by image'>
                <IconButton onClick={handleEdit}>
                  <PhotoCameraIcon/>
                </IconButton>
              </Tooltip>
              <StyledInput accept='image/jpeg' type={'file'} id="file" name="file" onChange={e => handleBrowse(e)}/>
            </Box>
          </Search>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {avatar
                ?<Avatar alt="UserName" src={avatar}/>
                :<Avatar>U</Avatar>
                }
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
            {email === ''
            ?<MenuItem onClick={() => handleCloseUserMenu}>
              <Typography textAlign="center" onClick={()=>{navigate('/Login')}}>{'log in'}</Typography>
            </MenuItem>
            :<MenuItem onClick={() => handleCloseUserMenu}>
              <Typography textAlign="center" onClick={()=>{navigate(`/profile/${localStorage.getItem('email')}`)}}>{'Profile'}</Typography>
            </MenuItem>
            }
            {email === ''
            ?<MenuItem onClick={() => handleCloseUserMenu}>
              <Typography textAlign="center" onClick={()=>{navigate('/Signup')}}>{'Sign in'}</Typography>
            </MenuItem>
            :<MenuItem onClick={() => handleCloseUserMenu}>
              <Typography textAlign="center" onClick={()=>{localStorage.setItem('email', ''); setEmail(''); enqueueSnackbar('You have logged out')}}>{'log out'}</Typography>
            </MenuItem>
            }
            
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}