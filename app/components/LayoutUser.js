import * as React from 'react';
import AppBarUser from './AppBarUser';

export default function LayoutUser({ children }) {
    return (
        <>
            <AppBarUser />
            <main>{children}</main>
        </>
    )
}