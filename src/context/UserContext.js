import React,{useState,createContext} from 'react'

export const UserContext = createContext();

export const UserProvider = (props)=>{
    const [state,setState] = useState({})
    return (
        <UserContext.Provider value={[state,setState]}>
            {props.children}
        </UserContext.Provider>
    )
}