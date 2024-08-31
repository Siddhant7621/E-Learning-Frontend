import {createContext, useContext, useEffect, useState} from 'react'
import axios from 'axios'
import { server } from '../main';
import toast, {Toaster} from "react-hot-toast"

const UserContext = createContext();

export const UserContextProvider = ({children}) => {

    const [user, setUser] = useState([])
    const [isAuth, setIsAuth] = useState(false)
    const [btnLoading, setBtnLoading] = useState(false)
    const [loading, setLoading] = useState(true)


    
    async function loginUser(email, password, navigate, fetchMyCourse) {
        setBtnLoading(true)
        try {
            const {data } = await axios.post(`${server}/api/user/login`, {email, password})

            toast.success(data.message);
            localStorage.setItem("token", data.token)
            setUser(data.user)
            setIsAuth(true)
            setBtnLoading(false)
            navigate('/');
            fetchMyCourse();
        } catch (error) {
            console.log(error)
            setBtnLoading(false)
            setIsAuth(false)
            toast.error(error.response.data.message)
        }
    }

    async function registerUser(name, email, password, navigate) {
        setBtnLoading(true);
        try {
            // Check if the fields are not empty
            if (!name || !email || !password) {
                throw new Error("All fields are required");
            }
            
            console.log("Sending registration request", { name, email, password });
            
            const { data } = await axios.post(`${server}/api/user/register`, { name, email, password });
            console.log("Registration successful:", data);
            
            toast.success(data.message);
            localStorage.setItem("activationToken", data.activationToken);
            setBtnLoading(false);
            navigate('/verify');
        } catch (error) {
            console.error("Registration failed:", error.response ? error.response.data : error.message);
            setBtnLoading(false);
            toast.error(error.response?.data?.message || "An error occurred during registration.");
        }
    }
    
    async function fetchUser() {
        const token = localStorage.getItem("token");
    
        if (!token) {
            console.log("No token found, user is not authenticated");
            setIsAuth(false);
            setLoading(false);
            return;
        }
    
        try {
            const { data } = await axios.get(`${server}/api/user/me`, {
                headers: {
                    token: token,
                },
            });
    
            setIsAuth(true);
            setUser(data.user);
        } catch (error) {
            console.error("Fetch User Error:", error.response ? error.response.data : error.message);
            setIsAuth(false);
        } finally {
            setLoading(false);
        }
    }

    async function verifyOtp(otp, navigate) {
        setBtnLoading(true);
        const activationToken = localStorage.getItem("activationToken");
    
        try {
            if (!otp || !activationToken) {
                throw new Error("OTP and activation token are required");
            }
    
            console.log("Sending OTP verification request", { otp });
    
            const { data } = await axios.post(`${server}/api/user/verify`, { otp, activationToken });
            console.log("OTP verification successful:", data);
    
            toast.success(data.message);
            navigate("/login");
            localStorage.clear();
        } catch (error) {
            console.error("OTP verification failed:", error.response ? error.response.data : error.message);
            toast.error(error.response?.data?.message || "An error occurred during OTP verification.");
        } finally {
            setBtnLoading(false);
        }
    }
    
    
    

    useEffect(() => {
        fetchUser()
    },[])

    return (
        <UserContext.Provider value={{user, setUser, setIsAuth, isAuth, loginUser, btnLoading, loading, registerUser, verifyOtp}}>
            {children}
            <Toaster/>
        </UserContext.Provider>
    )
} 

export const UserData = () => useContext(UserContext);