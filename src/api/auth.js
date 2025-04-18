import {url} from "./configuration";


export const register = async (body) => {
    const response = await fetch(`${url}/register`, {
        method:'POST',
        headers:{
            Accept: "application/json",
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(body) 
    })

    return await response.json()
}

export const login = async (body) => {
    const response = await fetch(`${url}/login`, {
        method:'POST',
        headers:{
            Accept: "application/json",
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(body) 
    })

    return await response.json()
}

export const checkToken = async (token) => {
    const response = await fetch(`${url}/checkToken`, {
        method:'GET',
        headers:{
            Accept: "application/json",
            "Content-Type": 'application/json',
            Authorization: `Bearer ${token}`
        },
    })

    return await response.json()
}

export const logout = async (token) => {
    const response = await fetch(`${url}/logout`, {
        method:'POST',
        headers:{
            Accept: "application/json",
            "Content-Type": 'application/json',
            Authorization: `Bearer ${token}`
        },
    })

    return await response.json()
}

export const insertLoginhistory = async (token) => {
    const response = await fetch(`${url}/login-history`, {
        method:'GET',
        headers:{
            Accept: "application/json",
            "Content-Type": 'application/json',
            Authorization: `Bearer ${token}`
        },
    })

    return await response.json()
}

// this is new to your codes!!

// Forgot Password
export const forgotPassword = async (body) => {
    const response = await fetch(`${url}/forgot-password`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  
    return await response.json();
  };

// Reset Password
export const resetPassword = async (body) => {
    const response = await fetch(`${url}/reset-password`, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(body)
    });

    return await response.json();
}; 