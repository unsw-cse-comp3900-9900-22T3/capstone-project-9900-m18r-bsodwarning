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
import Login from './pages/Login';
import Signup from './pages/Signup';
import RecipeDetail from './pages/RecipeDetail';
import UserProfile from './pages/UserProfile';

const Index = () => {
  return <>
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/RecipeEdit" element={<RecipeEdit />}></Route>
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/Signup" element={<Signup />}></Route>
          <Route path="/RecipeDetail" element={<RecipeDetail />}>
            <Route path="/RecipeDetail/:id" element={<RecipeDetail />}/>
          </Route>
          <Route path="/Profile" element={<UserProfile />}></Route>
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
