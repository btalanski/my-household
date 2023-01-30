import * as React from 'react';
import AppBarUser from './AppBarUser';
import BottomNav from './BottomNav';

export default function LayoutUser({ children }) {
    return (
        <>
            <AppBarUser />
            <main>{children}</main>
            <BottomNav />
        </>
    )
}