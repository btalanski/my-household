import PocketBase from 'pocketbase';
import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { pb } from '@/utils/pocketbase';

const ctx = createContext();

export function AppWrapper({ children }) {  
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoadingApp, setIsLoadingApp] = useState(true);    
    const authUser = useQuery('user', async() => await pb.authStore.model);
    
    useEffect(()=> { 
        console.log(authUser.isLoading, authUser.isSuccess, authUser.isError, pb.authStore.isValid, authUser.data);

        if(authUser.isLoading){
            setIsLoadingApp(() => true);
            return;
        }

        if(authUser.isError || authUser.isSuccess){
            setIsLoadingApp(() => false);
        }

        if(pb.authStore.isValid && authUser.data){
            setIsLoggedIn(() => true);
            setIsLoadingApp(() => false);
            //setAuthUser(() => authUser.data);
        }
    }, [pb.authStore.isValid, authUser.isLoading, authUser.isSuccess, authUser.isError, authUser.data]);

    const sharedState = { 
        pb,
        isLoggedIn,
        setIsLoggedIn,
        authUser: authUser.data,
        isLoadingApp,
        setIsLoadingApp
    }

    return (
        <ctx.Provider value={sharedState}>
        {children}
        </ctx.Provider>
    );
}

export function useAppContext() {
    return useContext(ctx);
}