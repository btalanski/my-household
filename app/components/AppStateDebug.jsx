import * as React from 'react';
import { useAppContext } from '@/context/AppContext';

export default function AppStateDebug() {
  const { isLoggedIn, isLoadingApp, authUser } = useAppContext();
  const state = { isLoggedIn, isLoadingApp, authUser };
  return (
    <></>
  );
}