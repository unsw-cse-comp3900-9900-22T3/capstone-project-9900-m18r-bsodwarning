import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Button, Chip, Grid, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { Stack } from '@mui/system';

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
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Tasty studio
          </Typography>
          <Search>
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
              <Typography textAlign="center" onClick={()=>{navigate('Login')}}>{'Log in'}</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleCloseUserMenu}>
              <Typography textAlign="center" onClick={()=>{navigate('Signup')}}>{'Sign in'}</Typography>
            </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
const RecipeContent = ( {info} ) => {
  const tags = ['beef', 'tomato', 'sauce', 'tomato', 'sauce', 'sauce', 'tomato', 'sauce', 'tomato', 'sauce', 'tomato', 'sauce']
  const Ingredients = [
    {'name':'xxx spoon', 'type': 'Ingredients1', 'calories': '100'},
    {'name':'xxx gram', 'type': 'Ingredients2', 'calories': '120'}
  ]
  function sum(arr) {
    var s = 0;
    for (var i=arr.length-1; i>=0; i--){
      s += Number(arr[i].calories)
    }
    return s;
  } 
  const RecipeStep = [
    {'img':'https://source.unsplash.com/random', 'Description':' this is Description of step 1'},
    {'img':'https://source.unsplash.com/random', 'Description':' this is Description of step 2'}
  ]
  const StyledImg = styled('img')(({theme}) => ({
    width:'94px',
    height:'94px',
    objectFit:'cover',
    borderRadius:'27px',
    marginRight:'54px'
  }));
  const Tittleimg= styled('img')(({theme})=>({
    width:'685px',
    height:'378px',
    borderRadius:'12px'
  }))
  const StepImg = styled('img')(({theme}) => ({
    width:'390px',
    height:'260px',
    borderRadius:'10px'
  }))
  return(
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ marginTop:'64px', width:'100%'}}>
      <Grid container spacing={3} width='685px' marginTop={12}>
        <Grid item xs={12} display="flex" flexDirection='row' alignItems="center">
          <StyledImg src='https://source.unsplash.com/random' alt='123'/>
          <Typography fontSize={'3em'} marginRight='54px'>uploader</Typography>
          <Button variant="contained">Follow</Button>
        </Grid>
        <Grid item xs={12}>
          <Tittleimg src='https://source.unsplash.com/random' alt='123' />
        </Grid>
        <Grid item xs={12}>
          <Typography fontSize={'2em'}>RECIPE NAME {`${info}`}</Typography>
          <Typography>This is discription</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography fontSize={'2em'}>TAGS</Typography>
          <Box display={'flex'} flexWrap={'wrap'}>
            {tags.map((info, key) => (
              <Chip  color="primary" label={`#${info}`} clickable key={key} sx={{ margin:'10px'}}/>
            ))}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography fontSize={'2em'}>Ingredients</Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650, border:0 }} aria-label="simple table">
              <TableBody>
                {Ingredients.map((info, key)=>(
                  <TableRow
                    key={key}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {info.name}
                    </TableCell>
                    <TableCell align="center">{info.type}</TableCell>
                    <TableCell align="right">{`${info.calories} calories`}</TableCell>
                  </TableRow>
                ))}
                <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {'Total Calories'}
                    </TableCell>
                    <TableCell align="center">{`${sum(Ingredients)} calories`}</TableCell>
                    <TableCell align="right">
                      <SentimentVeryDissatisfiedIcon/>
                      {`Exceeded your target calories`}
                    </TableCell>
                  </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12}>
          <Typography fontSize={'2em'} sx={{marginBottom:'16px'}}>{`Recipe Step`}</Typography>
          <Stack spacing={2}>
            {RecipeStep.map((info,key) => (
              <>
                <Typography fontSize={'1.2em'} key={key}>{`STEP ${key+1}/${RecipeStep.length}`}</Typography>
                <Box display={'flex'} flexDirection='row'>
                  <StepImg src={`${info.img}`} alt={'123'}/>
                  <Typography sx={{paddingLeft:'1em'}}>{`${info.Description}`}</Typography>
                </Box>
              </>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default function RecipeDetail() {
  const param = useParams();

  return(<>
  <Header/>
  <RecipeContent info={param.id}/>
  </>);
}