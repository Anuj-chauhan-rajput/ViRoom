import axios from "axios";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const navigate = useNavigate();

    const login = async (inputs) => {
        try {
            const response = await axios.post('http://localhost:6001/auth/login', inputs);
            const data = response.data;

            localStorage.setItem('userToken', data.token);
            localStorage.setItem('userId', data.user._id);
            localStorage.setItem('userName', data.user.username);
            localStorage.setItem('userEmail', data.user.email);

            navigate('/');
        } catch (err) {
            console.log(err);
        }
    };

    const register = async (inputs) => {
        try {
            console.log(inputs);
            console.log("SDSD");

            const response = await fetch("http://localhost:6001/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(inputs)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            localStorage.setItem('userToken', data.token);
            localStorage.setItem('userId', data.user._id);
            localStorage.setItem('userName', data.user.username);
            localStorage.setItem('userEmail', data.user.email);

            navigate('/');
        } catch (err) {
            console.log(err);
        }
    };

    const logout = async () => {
        try {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            navigate('/');
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <AuthContext.Provider value={{ login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
