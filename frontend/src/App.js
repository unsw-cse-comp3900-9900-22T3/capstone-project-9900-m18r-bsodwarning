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
import CreatRecipe from './pages/RecipeCreate';
import TryPage from './pages/TryPage';
import SubscribePage from './pages/SubscribePage';
import EditRecipe from './pages/RecipeEdit';
import SearchResult from './pages/Search';

const Index = () => {
  return <>
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/try" element={<TryPage />}></Route>
          <Route path="/recipeEdit" element={<RecipeEdit />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/reset" element={<ResetPassword />}></Route>
          <Route path="/welcome" element={<Welcome />}></Route>
          <Route path="/Subscribe" element={<SubscribePage />}></Route>
          <Route path="/recipeDetail" element={<RecipeDetail />}>
            <Route path="/recipeDetail/:id" element={<RecipeDetail />}/>
          </Route>
          <Route path="/recipecreate" element={<CreatRecipe />}/>
          <Route path="/recipeEdit" element={<EditRecipe />}>
            <Route path="/recipeEdit/:id" element={<EditRecipe/>}/>
          </Route>
          <Route path="/profile" element={<UserProfile />}>
            <Route path="/profile/:email" element={<UserProfile/>} />
          </Route>
          <Route path="/search" element={<SearchResult />}>
            <Route path="/search/:info/:method" element={<SearchResult/>} />
          </Route>
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
