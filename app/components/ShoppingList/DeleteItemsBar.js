import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

export default function DeleteItemsBar(props) {
  const { selectedItems, deleteCallback } = props;
  return (
    <Box sx={{ position: 'fixed', width: '100%', top: 0, zIndex: 1101 }}>
      <AppBar component="nav" color="secondary" sx={{ boxShadow: 'none' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Selected items: {selectedItems.length}
          </Typography>
          <Button variant="outlined" color="secondary" startIcon={<DeleteIcon />} sx={{ color: '#fff' }} onClick={deleteCallback}>
            Delete
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
