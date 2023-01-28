import * as React from 'react';
import AppBarSimple from './AppBarSimple';

export default function Layout({ children }) {
    return (
        <>
            <AppBarSimple />
            <main>{children}</main>
        </>
    )
}