import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { AppBar, Box, Toolbar, Typography, InputBase, Tooltip, IconButton, Avatar, Menu, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from "notistack";
import ExploreIcon from '@mui/icons-material/Explore';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';


// Header
export default function Header ({Htype}) {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar();
  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    border:'1px solid black',
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
  const StyledSearchIcon = styled(SearchIcon)(({ theme }) =>({
    color:theme.palette.common.black
  }))
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    // color: 'inherit',
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
  // search method
  const [method, setMethod] = React.useState('title');
  const handleChange = (event) => {
    setMethod(event.target.value);
  };
  //user email
  const [email, setEmail] = React.useState()
  let avatar = React.useRef(localStorage.getItem('avatar'))

  React.useEffect(() => {
    const userEmail = localStorage.getItem('email')? localStorage.getItem('email') : undefined
    avatar.current = localStorage.getItem('avatar')
    window.addEventListener("setItemEvent", e => {
      if(e.key === 'avatar'){
        avatar.current = localStorage.getItem('avatar')
      }
    })
    // console.log(avatar)
    // console.log(userEmail)
    setEmail(userEmail)

    return () => {
      window.removeEventListener("setItemEvent", e => {
        if(e.key === 'avatar'){
          avatar.current = localStorage.getItem('avatar')
        }
      })
    }
  },[avatar])
  
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
      localStorage.setItem('searchImg',searchImg)
      navigate(`/search/searchImg/image`)
      window.location.reload()
    }, false)
    reader.readAsDataURL(data)
  }
  return(
    <Box sx={{ flexGrow: 1, position: 'fixed', left:0, right:0, top:0, zIndex:1}}>
      <AppBar position="static" >
        <Toolbar sx={{ backgroundColor:'#F6FEEA'}}>
          {/*Button back to home page */}
          {(Htype && Htype === 1)
            && <IconButton onClick={() => navigate('/')}>
              <ChevronLeftIcon/>
            </IconButton>
          }
          {/* title of webset */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block', color:'black' } }}
          >
            Taste studio
          </Typography>
          {/* search method select input */}
          <FormControl size="small">
              <InputLabel htmlFor="demo-simple-select-label">Search Method</InputLabel>
              <Select
                // labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={method}
                label="method"
                onChange={handleChange}
              >
                <MenuItem value={'title'}>Recipe Name</MenuItem>
                <MenuItem value={'ingredients'}>Ingredient</MenuItem>
              </Select>
            </FormControl>
          {/* search  */}
          <Search>
            <Box  component='form' onSubmit={handleSearch}>
              <SearchIconWrapper>
                <StyledSearchIcon color='error'/>
              </SearchIconWrapper>
              <StyledInputBase
                placeholder= {`search recipe by ${method}`}
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
          {/* Button to create recipe and navigate to subscribe page */}
          {email &&
          <React.Fragment>
            <Tooltip title='Create Recipe'>
              <IconButton onClick={e => navigate('/recipecreate')}>
                <AddBoxIcon/>
              </IconButton>
            </Tooltip>
            <Tooltip title='Subscribe'>
              <IconButton onClick={e => navigate('/subscribe')}>
                <ExploreIcon/>
              </IconButton>
            </Tooltip>
          </React.Fragment>
          }
          {/* avatar */}
          <Box sx={{ flexGrow: 0, marginLeft:'2em' }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {avatar
                ?<Avatar alt="UserName" src={avatar.current}/>
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
            {!email
            ?<MenuItem onClick={() => handleCloseUserMenu}>
              <Typography textAlign="center" onClick={()=>{navigate('/Login')}}>{'log in'}</Typography>
            </MenuItem>
            :<MenuItem onClick={() => handleCloseUserMenu}>
              <Typography textAlign="center" onClick={()=>{navigate(`/profile/${localStorage.getItem('email')}`)}}>{'Profile'}</Typography>
            </MenuItem>
            }
            {!email
            ?<MenuItem onClick={() => handleCloseUserMenu}>
              <Typography textAlign="center" onClick={()=>{navigate('/Signup')}}>{'Sign in'}</Typography>
            </MenuItem>
            :<MenuItem onClick={() => handleCloseUserMenu}>
              <Typography textAlign="center" onClick={()=>{localStorage.setItem('email', ''); localStorage.setItem('avatar', ''); enqueueSnackbar('You have logged out'); navigate('/'); window.location.reload()}}>{'log out'}</Typography>
            </MenuItem>
            }
            
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}