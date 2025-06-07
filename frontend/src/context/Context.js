import { createContext,useContext } from "react";

export const AppContext=createContext({
    isAuthenticated:false,
    isLoadingAuth: true, 
    login: () => {},
    logout: () => {}
})

export const useAppContext=()=>{
    return useContext(AppContext);
}

// export const AppProvider=AppContext.Provider;