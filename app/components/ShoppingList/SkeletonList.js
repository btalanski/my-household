import * as React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export default function SkeletonList(){
    return (
        <Box sx={{ width: '100%', maxWidth: 580 }}>
            {[0,1,2,3,4,5].map((value) => (<Skeleton key={`sk_${value}`} variant="rectangular" animation="wave" height={56} sx={{ margin: 1}} />))}
        </Box>
    )
}