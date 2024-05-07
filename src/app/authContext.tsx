import React, { useContext } from "react";
import { IUser } from "./backend";

interface IAuthContext {
    user: IUser;
    signOut: () => void;
}

export const authContext = React.createContext<IAuthContext>({
    user: {
        name: "Anonymos",
        email: ""
    },
    signOut: () => {},
});

export function useAuthContext(){
    return useContext(authContext);
}