import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import RecipeCard from '../components/RecipeCard';
import HomeTopBar from '../components/HomeTopBar';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Pagination from '@mui/material/Pagination';

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

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const theme = createTheme(
  {
    palette: {
      neutral: {
        main: '#64748B',
        contrastText: '#fff',
      },
    }
  }
);

const style = {
  width: '100%',
  maxWidth: 360,
  bgcolor: 'background.paper',
};

const LeftBar = () => {
  return (
    <List sx={style} component="nav" aria-label="mailbox folders">
      <Divider />
      <ListItem button>
        <ListItemText primary="1" />
      </ListItem>
      <Divider />
      <ListItem button divider>
        <ListItemText primary="2" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="3" />
      </ListItem>
      <Divider light />
      <ListItem button>
        <ListItemText primary="4" />
      </ListItem>
      <Divider />
    </List>
  )
}

const BOARD = () => {
  const [page, setPage] = React.useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <Stack spacing={2}>
      <Typography>Page: {page}</Typography>
      <img
      src='https://source.unsplash.com/random'
      height={200}
      alt={'123'}
      />
      <Pagination count={4} page={page} onChange={handleChange} />
    </Stack>
  );
}

export default function Album() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HomeTopBar />
      <main>
        {/* Hero unit */}
        <Stack sx={ {py:4, px:4} } direction="row" spacing={2} maxWidth="md">
          {/* End hero unit */}
          <Grid container xs={3}>
            <LeftBar />
          </Grid>
          <Grid container spacing={2} xs={12}>
            {/* BOARD */}
            <Grid xs={12}>
              <BOARD />
            </Grid>
            {/* BOARD */}
            {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <RecipeCard />
              </Grid>
            ))}
          </Grid>
          <Grid container xs={2}>
            123
          </Grid>
        </Stack>
      </main>
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
    </ThemeProvider>
  );
}