import { createContext, useContext} from 'react';

const ctx = createContext();

export function AppWrapper({ children }) {  
    const sharedState = {}

    return (
        <ctx.Provider value={sharedState}>
        {children}
        </ctx.Provider>
    );
}

export function useAppContext() {
    return useContext(ctx);
}