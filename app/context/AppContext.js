import PocketBase from 'pocketbase';
import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { pb } from '@/utils/pocketbase';

const ctx = createContext();

export function AppWrapper({ children }) {  
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authUser, setAuthUser] = useState(null);
    const [isLoadingApp, setIsLoadingApp] = useState(true);
    
    const getUser = async() => await pb.authStore.model;
    const userQuery = useQuery('user', getUser);
    
    useEffect(()=> { 
        console.log(userQuery.isSuccess, pb.authStore.isValid, userQuery.data);

        if(userQuery.isSuccess){
            setIsLoadingApp(() => false);
        }

        if(pb.authStore.isValid && userQuery.data){
            setIsLoggedIn(() => true);
            setAuthUser(() => userQuery.data);
        }
    }, [pb.authStore.isValid, userQuery.isSuccess, userQuery.data]);

    const sharedState = { 
        pb,
        isLoggedIn,
        setIsLoggedIn,
        authUser,
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