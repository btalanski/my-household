import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
const actions = [
   { icon: <ShoppingBasketIcon />, name: 'Add' },

];

export default function GroceriesDial() {
  return (
    <Box sx={{ position: 'fixed', bottom: 60, left: 0, right: 0, zIndex: 10 }}>
      <SpeedDial
        ariaLabel="Actions list"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipOpen
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}