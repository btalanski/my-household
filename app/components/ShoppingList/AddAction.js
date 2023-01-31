import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import AddItemDialog from './AddItemDialog';

export default function AddAction() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
    <AddItemDialog {...{open, handleClose}}/>
    <Box sx={{ position: 'absolute', bottom: 80, right: 16, zIndex: 10 }}>
      <Fab color="primary" aria-label="add" onClick={handleClickOpen}>
        <AddIcon />
      </Fab>
    </Box>
    </>
  );
}