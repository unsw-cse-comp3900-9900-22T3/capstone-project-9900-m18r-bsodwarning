import './App.css';
import * as React from 'react';
import { SnackbarProvider } from 'notistack';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Home from './pages/Home';
import { Box } from '@mui/system';
import RecipeEdit from './pages/RecipeEdit';

const Index = () => {
  return <>
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/" element={<RecipeEdit />}></Route>
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  </>
}

function App() {

  return <Box>
    <SnackbarProvider maxSnack={3}>
      <Index/>
    </SnackbarProvider>
  </Box>
}

export default App;
