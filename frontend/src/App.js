import './App.css';
import * as React from 'react';
import { SnackbarProvider } from 'notistack';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Home from './pages/Home';

const Index = () => {
  return <>
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  </>
}

function App() {
  return <>
    <SnackbarProvider maxSnack={3}>
      <Index />
    </SnackbarProvider>
  </>
}

export default App;
