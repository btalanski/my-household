import * as React from 'react';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Link from '@/components/Link';

export default function BottomNav() {
  const [value, setValue] = React.useState(null);

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
            setValue(newValue);
            }}
        >
            <BottomNavigationAction label="Shopping" icon={<LocalGroceryStoreIcon />} component={Link} href='/dashboard/shopping-list' />
            <BottomNavigationAction label="To dos" icon={<ListAltIcon />} component={Link} href='/dashboard/todos' />
            <BottomNavigationAction label="Meals" icon={<CalendarMonthIcon />} />
        </BottomNavigation>
    </Paper>
  );
}