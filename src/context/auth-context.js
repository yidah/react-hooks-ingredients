import React, {useState} from 'react';

//  createContext is provided by React
export const AuthContext = React.createContext({
    isAuth:false,
    login:()=>{}

});

// Normal react function component 
const AuthContextProvider = props=>{
    // As I only want to handle if the user is authenticated or not I use useState
    const [isAuthenticated, setIsAuthenticted] = useState(false);

    const loginHandler = () =>{
        setIsAuthenticted(true);
    }

    return(
    // value is the value that will be propagated to whoever is listening 
    <AuthContext.Provider value={{login:loginHandler, isAuth:isAuthenticated}}>
        {props.children}
    </AuthContext.Provider>
    );
};

export default AuthContextProvider;




