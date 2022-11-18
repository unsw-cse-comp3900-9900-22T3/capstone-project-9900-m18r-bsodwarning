import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Button, Grid , TextField, IconButton } from '@mui/material';
import { Stack } from '@mui/system';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import ClearIcon from '@mui/icons-material/Clear';
import Link from '@mui/material/Link';
import { callApi } from '../components/FunctionCollect';
import Header from '../components/Header';

const StyledInput = styled('input')(({theme}) => ({
  display:'none'
}))//hidden input

const StyledImg = styled('img')(({theme}) => ({
  objectFit:'cover',
  width:'100%',
  height:'100%',
  borderRadius:'10px'
}))

const RecipeContent = ({info_ID}) => {
  const [allInfo, setAllInfo] = React.useState('')
  React.useEffect(() => {
    const email = localStorage.getItem('email')
    callApi(`/recipe/details/${info_ID}/${email ? email: '0'}`, 'GET')
      .then(data=>{
        console.log(data)
        setAllInfo(data.detail)
      })
      .catch(err => {console.log(err)})
  },[info_ID])
  // Submit
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget)
    const ingredient = data.getAll('ingredient')
    const amount = data.getAll('amount')
    const tags = (data.get('tags')).split(',')
    const calories = data.get('calories')
    // form ingredient
    var ingredients = []
    ingredient.map((ig,i) => {
      return ingredients[i] = {ingredient:ig, amount:amount[i]}
    })
    // form Step
    const StepDes = data.getAll('StepDes')
    const thisIMG = []
    for(var i=0; i>=0; i++){
      if(document.getElementById(`StepIMG${i}`)){
        const v = document.getElementById(`StepIMG${i}`).src
        thisIMG[i] = {cover:v, description:StepDes[i]}
      }else{
        break
      }
    }
    const info = {
      email: localStorage.getItem('email'),
      name:data.get('name'),
      cover:document.getElementById('coverIMG').src,
      description:data.get('discription'),
      ingredient: ingredients,
      Step:thisIMG,
      tags,
      calories
    }
    console.log(info)
    callApi(`/recipe/edit/${info_ID}`, 'POST', info)
      .then(data => {
        console.log(data)
        navigate('/')
      })
      .catch(err => console.log(err))
  }
  // first party
  function BasicPart() {
    const [coverImg, setCover] = React.useState(allInfo.cover ? allInfo.cover : '') // Basic part, cover of the Recipe
    //triger of file input
    const handleEdit = () => {
      document.getElementById('fileD').click()
    }
    // view of selected img
    const handleBrowse = (e) => {
      const data = e.target.files[0]
      var reader = new FileReader()
      reader.addEventListener("load", function() {
        setCover(reader.result)
      }, false)
      reader.readAsDataURL(data)
    }
    const displayTag = (info) => {
      var output = info.join(',')
      // info.map((info, index) => (
      //   output = output + ',' +info
      // ))
      return output
    }
    return(
      <Grid item xs={12}>
        <Typography fontSize={'3em'}>Basics</Typography>
        <Stack sx={{ margin:'64px 10% 0 10%'}} spacing={2}>
          {/* name */}
          <Typography>NAME YOUR RECIPE</Typography>
          <TextField margin="normal" required autoFocus id='name' name='name' defaultValue={allInfo && allInfo.title}/>
          {/* photo */}
          <Typography>ADD PHOTO</Typography>
          <Box display={'flex'} flexDirection='row' alignItems={'center'} justifyContent='space-between'>
            <Box sx={{position:'relative', width:'380px', height:'260px', border:'1px solid black', borderRadius:'10px'}}>
              <StyledImg id='coverIMG' src={coverImg ? coverImg : '/upload_Holder.png'} alt='404'/>
              <IconButton color='primary' onClick={handleEdit} sx={{position:'absolute', right:'10px', bottom:'10px'}}>
                <ModeEditIcon/>
              </IconButton>
              {/* hidden input */}
              <StyledInput accept='image/jpeg' type={'file'} id="fileD" name="fileD" onChange={e => handleBrowse(e)}/>
            </Box>
            <Typography align='center' sx={{margin:'20px'}}>Image must be original personal photos,in jpg format</Typography>
          </Box>
          {/* ADD DESCRIPTION */}
          <Typography>ADD DESCRIPTION</Typography>
          <TextField margin="normal" required id='discription' name='discription' defaultValue={allInfo.description}/>
          {/* Tag */}
          <Typography>ADD Tags</Typography>
          <TextField margin="normal" id='tags' defaultValue={allInfo && displayTag(allInfo.category)} name='tags' label={'E.g. Breakfast, Main, Beverage, Chinese, European'}/>
        </Stack>
      </Grid>
    )
  }
  // Second part
  function IngredientPart() {
    const [ingredient, setIngredient] = React.useState(allInfo.ingredients)
    const handleAddIngredient = () => {
      setIngredient([...ingredient, {amount:'', ingredient:''}])
    }
    const handleDeleteIngredient = (prop) => {
      var newIngre = [...ingredient]
      newIngre.splice(prop, 1)
      setIngredient(newIngre)
    }
    const handleChange = (type, index) => (event) => {
      var newIngre = [...ingredient]
      newIngre[`${index}`][`${type}`] = event.target.value
      console.log(newIngre)
      setIngredient(newIngre)
    }
    const IngredientInfo = ({props}) => {
      const {info, index} = props
      return (
        <Box sx={{width:'100%',display:'flex', flexDirection:'row', }}>
          <TextField
          sx={{width:'40%'}} 
          label={index === 0 ? 'E.g. Chicken fillet' : undefined}
          id={`ingredient`}
          name={`ingredient`}
          defaultValue={info ? info.ingredient : undefined}
          onBlur={handleChange('ingredient',index)}
          />
          <TextField 
          sx={{width:'40%'}} 
          label={index === 0 ? 'E.g. 400 grams' : undefined} 
          id={`amount`}
          name={`amount`}
          defaultValue={info ? info.amount : undefined}
          onBlur={handleChange('amount',index)}
          />
          <IconButton sx={{marginLeft:'10px'}} onClick={() => handleDeleteIngredient(index)}>
            <ClearIcon/>
          </IconButton>
        </Box>
      )
    }
    return(
      <Grid item xs={12}>
        <Typography fontSize={'3em'}>Ingredient</Typography>
        <Stack sx={{ margin:'64px 10% 0 10%'}} spacing={2}>
          <Box sx={{width:'100%',display:'flex', flexDirection:'row', }}>
            <Typography width='40%'>INGREDIENT</Typography>
            <Typography width='40%'>AMOUNT</Typography>
          </Box>
          {ingredient && ingredient.map((info,index) => (
            <IngredientInfo key={index} props={{info, index}}/>
          ))}
          
          <Box
            component={'button'}
            type={'button'}
            sx={{ border:'1px solic black' , 
                  width:'80%', 
                  height:'40px', 
                  display:'flex', 
                  flexDirection:'row', 
                  alignItems:'center', 
                  justifyContent:'center',
                  backgroundColor:'white',
                  cursor: "pointer"
                }}
            onClick={handleAddIngredient}
            >
            <ControlPointIcon/>
            <Typography>ADD ONE MORE INGREDIENT</Typography>
          </Box>
          <TextField margin="normal" required defaultValue={allInfo && allInfo.calories} id='calories' name='calories' label={'Total calories'} sx={{width:'40%'}}/>
        </Stack>
      </Grid>
    )
  }
  function RecipeStep() {
    const [step, setStep] = React.useState([{stepIMG:'',discription:''}])
    React.useEffect(() => {
      if(allInfo && allInfo.instructions_list){
        var newStep = []
        for(var i=0; i<(allInfo.instructions_list).length; i++){
          newStep = [...newStep, {stepIMG:(allInfo.stepImage_list)[i],discription:(allInfo.instructions_list)[i]}]
        }
        setStep(newStep)
      }
    },[])
    const handleAddIngredient = () => {
      setStep([...step, {stepIMG:'',discription:''}])
    }
    const handleDeleteStep = (prop) => {
      var newstep = [...step]
      newstep.splice(prop, 1)
      setStep(newstep)
    }
    const handleChange = (index) => (event) => {
      var newstep = [...step]
      newstep[`${index}`]['discription'] = event.target.value
      console.log(newstep)
      setStep(newstep)
    }
    const StepInfo = ({props}) => {
      const {info, index} = props
      const handleEdit = () => {
        document.getElementById(`file${index}`).click()
      }//triger of file input
      const handleBrowse = (e) => {
        const data = e.target.files[0]
        var reader = new FileReader()
        reader.addEventListener("load", function() {
          var newStep = [...step]
          newStep[index]['stepIMG'] = reader.result
          setStep(newStep)
        }, false)
        reader.readAsDataURL(data)
      }
      return (
        <Box sx={{width:'100%',display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
          <Box sx={{position:'relative', width:'380px', height:'260px', border:'1px solid black', borderRadius:'10px'}}>
            <StyledImg id={`StepIMG${index}`} src={info['stepIMG'] ? info['stepIMG'] : '/upload_Holder.png'} alt='402'/>
            <IconButton color='primary' onClick={handleEdit} sx={{position:'absolute', right:'10px', bottom:'10px'}}>
              <ModeEditIcon/>
            </IconButton>
            <StyledInput accept='image/jpeg' type={'file'} id={`file${index}`} name="file" onChange={e => handleBrowse(e)}/>
          </Box>
          <TextField 
          sx={{width:'40%', height:'100%'}} 
          label='add your discription here' 
          id='StepDes'
          name='StepDes'
          defaultValue={info['discription'] ? info['discription'] : undefined}
          onBlur={handleChange(index)}
          multiline
          rows='10'
          />
          <IconButton sx={{marginLeft:'10px'}} onClick={() => handleDeleteStep(index)}>
            <ClearIcon/>
          </IconButton>
        </Box>
      )
    }
    return(
      <Grid item xs={12}>
        <Typography fontSize={'3em'}>Step</Typography>
        <Stack sx={{ margin:'64px 10% 0 10%'}} spacing={2}>
          {step.map((info,index) => (
            <Box key={index}>
              <Typography>{`STEP ${index+1}`}</Typography>
              <StepInfo key={index} props={{info, index}}/>
            </Box>
          ))}
          
          <Box
            component={'button'}
            type={'button'}
            sx={{ border:'1px solic black' , 
                  width:'91%', 
                  height:'40px', 
                  display:'flex', 
                  flexDirection:'row', 
                  alignItems:'center', 
                  justifyContent:'center',
                  backgroundColor:'white',
                  cursor: "pointer"
                }}
            onClick={handleAddIngredient}
            >
            <ControlPointIcon/>
            <Typography>ADD ONE MORE STEP</Typography>
          </Box>
        </Stack>
      </Grid>
    )
  }
  const navigate = useNavigate()
  return(
    <Box component="form" onSubmit={handleSubmit} noValidate display="flex" justifyContent="center" alignItems="center" sx={{ marginTop:'64px', width:'100%'}}>
      <Grid container width='1000px' marginTop={12} spacing={2}>
        <BasicPart/>
        <IngredientPart/>
        <RecipeStep />
        <Grid item xs={12}>
          <Box sx={{width:'100%', display:'flex', flexDirection:'row', justifyContent:'center', margin:'20px 0'}}>
            <Button variant="contained" color='error' sx={{margin:'0 40px'}} onClick={() => navigate('/')}>
              Give up
            </Button>
            <Button type="submit" variant="contained" sx={{margin:'0 40px'}}>
              submit
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default function CreatRecipe() {
  const param = useParams();
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
  return(<>
  <Header/>
  <RecipeContent info_ID={param.id}/>
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
  </>);
}