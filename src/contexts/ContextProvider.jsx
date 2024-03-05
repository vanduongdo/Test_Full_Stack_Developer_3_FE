import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    user: null,
    currentUser: null,
    mySubscription: null,
    token: null,
    setUser: () => {},
    setToken: () => {},
    setMySubscription: () => {},
});

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [mySubscription, setMySubscription] = useState({});
    const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
    // localStorage.getItem("ACCESS_TOKEN")

    const setToken = (token) => {
        _setToken(token);
        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
        }
    };

    return (
        <StateContext.Provider value={{ user, token, mySubscription, setUser, setToken, setMySubscription }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
