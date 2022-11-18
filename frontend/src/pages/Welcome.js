import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Chip, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useNavigate } from 'react-router-dom';
import BasicModal from '../components/InputModal';
import { callApi } from '../components/FunctionCollect';


function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="http://localhost:3000/">
        Taste Studio
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Welcome () {
  const navigate = useNavigate()
  const theme = createTheme();

  const steps = ['Basic Info', 'Prefer', 'Allergies'];

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <Welcome1 />;
      case 1:
        return <Welcome2 />;
      case 2:
        return <Welcome3 />;
      default:
        throw new Error('Unknown step');
    }
  }
  const [activeStep, setActiveStep] = React.useState(0);
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  const [username, SetName] = React.useState('')
  const [age, SetAge] = React.useState('')
  const [gender, setGender] = React.useState('');
  const [level, setLevel] = React.useState('');
  const [spend, setSpend] = React.useState('');

  const handleChange = (prop) => (event) => {
    if(prop === 'gender'){
      setGender(event.target.value);
    }else if(prop === 'level'){
      setLevel(event.target.value)
    }else if(prop === 'spend'){
      setSpend(event.target.value)
    }else if(prop === 'name'){
      SetName(event.target.value)
    }else if(prop === 'age'){
      SetAge(event.target.value)
    }
  };
  function Welcome1() {
    
    return(
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <TextField
            required
            id="Name"
            name="Name"
            label="How to call you?"
            variant="standard"
            defaultValue={username}
            fullWidth
            onBlur={handleChange('name')}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            id="Age"
            name="Age"
            label="age"
            fullWidth
            variant="standard"
            defaultValue={age}
            onBlur={handleChange('age')}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            {!gender && <InputLabel id='Gender-123'>gender</InputLabel>}
            <Select
              labelId='Gender-123'
              id='Gender-123'
              value={gender}
              onChange={handleChange('gender')}
            >
              <MenuItem value={'male'}> Male</MenuItem>
              <MenuItem value={'female'}> Female</MenuItem>
              <MenuItem value={'custom'}> Custom</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            {!level && <InputLabel id='Level'>Your cooking level</InputLabel>}
            <Select
              labelId='level'
              id='level'
              value={level}
              onChange={handleChange('level')}
            >
              <MenuItem value={'Beginner'}> Beginner</MenuItem>
              <MenuItem value={'Experienced'}> Experienced</MenuItem>
              <MenuItem value={'Chef'}> Chef</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            {!spend && <InputLabel id='Spend'>The time you are willing to spend</InputLabel>}
            <Select
              labelId='Spend'
              id='Spend'
              value={spend}
              onChange={handleChange('spend')}
            >
              <MenuItem value={'10min'}> 10min</MenuItem>
              <MenuItem value={'30min'}> 30min</MenuItem>
              <MenuItem value={'1h'}> 1h</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    )
  }
  const [preferTags, setAllTags] = React.useState([
    'Meat', 'Seafood', 'Low calories', 
    'Soup', 'Noodles', 'Dessert', 'Chinese Food', 
    'Thailand Food', 'Japanese Food'
  ])
  const [prefered, setPrefered] = React.useState([])
  const handlePrefer = (prop) => (event) => {
    if(prefered.find(v => v===prop)){
      const newPrefered = [...prefered]
      newPrefered.splice(prefered.findIndex(v => v===prop), 1)
      setPrefered(newPrefered)
  }else {
      const newPrefered = [...prefered, prop]
      setPrefered(newPrefered)
  }
  }
  function Welcome2() {
    const addTag = (info) => {
      if(preferTags.includes(info)){
        console.log(`${info} have already in Tags`)
      }else{
        const newTags = [...preferTags, info]
        setAllTags(newTags)
      }
    }
    return(
      <Grid container>
        <Grid item xs={12} display='flex' justifyContent={'center'}>
          <Typography fontSize={'2em'}>You may prefer....</Typography>
        </Grid>
        <Grid item xs={12}>
          {preferTags.map((tag, index) => (
            <Chip 
              color={prefered.find(v => v===tag)?"success":"primary"} 
              label={`#${tag}`} 
              clickable 
              key={index} 
              sx={{ margin:'10px', marginTop:'20px'}}
              onClick={handlePrefer(tag)}
            />
          ))}
          <BasicModal onABC={addTag} info={'add'}/>
        </Grid>
      </Grid>
    )
  }
  const [avoidTag,setAllAvoid] = React.useState([
    'Meat', 'Seafood', 'Low calories', 
    'Soup', 'Noodles', 'Dessert', 'Chinese Food', 
    'Thailand Food', 'Japanese Food'
  ])
  const [avoid, setAvoid] = React.useState([])
  const handleAvoid = (prop) => (event) => {
    if(avoid.find(v => v===prop)){
      const newAvoid = [...avoid]
      newAvoid.splice(avoid.findIndex(v => v===prop), 1)
      setAvoid(newAvoid)
  }else {
      const newAvoid = [...avoid, prop]
      setAvoid(newAvoid)
  }
  }
  function Welcome3() {
    const addTag = (info) => {
      if(avoidTag.includes(info)){
        console.log(`${info} have already in Tags`)
      }else{
        const newTags = [...avoidTag, info]
        setAllAvoid(newTags)
      }
    }
    return(
      <Grid container>
        <Grid item xs={12} display='flex' justifyContent={'center'}>
          <Typography fontSize={'2em'}>Allergic or disliked food to avoid</Typography>
        </Grid>
        <Grid item xs={12}>
          {avoidTag.map((tag, index) => (
            <Chip 
              color={avoid.find(v => v===tag)?"success":"primary"} 
              label={`#${tag}`} 
              clickable 
              key={index} 
              sx={{ margin:'10px', marginTop:'20px'}}
              onClick={handleAvoid(tag)}
            />
          ))}
          <BasicModal onABC={addTag} info={'add'}/>
        </Grid>
      </Grid>
    )
  }
  const handleNext = () => {
    if(activeStep === 2){
      const info = {
        username,
        age,
        email:localStorage.getItem('email'),
        gender,
        level,
        'time':spend,
        'preference':prefered,
        'allergies':avoid
      }
      console.log(info)
      callApi('/profile/alter', 'POST', info)
        .then(data => {
          console.log(data)
        })
        .catch(err => {
          console.log(err)
        })
    }
    setActiveStep(activeStep + 1);
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: 'relative',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Taste studio
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }}}>
          <Typography component="h1" variant="h4" align="center">
          {`Welcome to Taste Studio!`}
          <br/>
          {`Let us know more about you！`}
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? (
              <Box sx={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center'}}>
                <Typography variant="h5" gutterBottom align='center'>
                  Thank you for your patient.
                </Typography>
                <Typography variant="subtitle1" align='center'>
                  {'We will recommand recipes according to your info'}
                  <br/>
                  {'You can change those info in your own profile'}
                </Typography>
                <Button variant="contained" onClick={()=>{navigate('/')}} sx={{margin:"50px 50px 0 50px "}}>Home</Button>
              </Box>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="contained"
                    color='success'
                    sx={{ mt: 3, ml: 1 }}
                    onClick={()=>navigate('/')}
                  >Skip
                  </Button>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                      Back
                    </Button>
                  )}
                  
                  {activeStep === steps.length - 1
                  ? <Button variant="contained" onClick={handleNext} sx={{ mt: 3, ml: 1 }} >Submit</Button>
                  : <Button variant="contained" onClick={handleNext} sx={{ mt: 3, ml: 1 }} >Next</Button>}
                </Box>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
        <Copyright />
      </Container>
    </ThemeProvider>
  )
}