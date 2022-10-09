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
import ResetPassword from './pages/ResetPassword';
import Welcome from './pages/Welcome';
import CreatRecipe from './pages/CreatRecipe';

const Index = () => {
  return <>
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/recipeEdit" element={<RecipeEdit />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/reset" element={<ResetPassword />}></Route>
          <Route path="/welcome" element={<Welcome />}></Route>
          <Route path="/recipeDetail" element={<RecipeDetail />}>
            <Route path="/recipeDetail/:id" element={<RecipeDetail />}/>
          </Route>
          <Route path="/recipecreate" element={<CreatRecipe />}/>
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
