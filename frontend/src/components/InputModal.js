import * as React from 'react';
import { Box, Chip, Button, TextField } from '@mui/material';
// import Typography from '@mui/material/Typography';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display:'flex',
  flexDirection:'row',
  alignItems:'center'
};

export default function BasicModal({info, onABC}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onABC(data.get('tag'))
  }
  return (
    <div>
      <Chip onClick={handleOpen} color="primary" label="New" clickable sx={{ margin:'10px', marginTop:'20px'}} avatar={<AddCircleIcon color='primary'/>}/>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box component={'form'} onSubmit={handleSubmit} sx={style}>
          <TextField id='tag' name='tag'></TextField>
          <Button type='submit'>Submit</Button>
        </Box>
      </Modal>
    </div>
  );
}
