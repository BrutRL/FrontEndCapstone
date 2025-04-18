import {url} from "./configuration";


export const index = async (token) => {

    const response = await fetch(`${url}/users`, {
        method:'GET',
        headers:{
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
    })

    return await response.json()
}



export const userAchive = async (token) => {
    const response = await fetch(`${url}/users/archive`, {
        method: 'GET',
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
    });

    const data = await response.json();
    return {
        ok: response.ok,
        status: response.status,
        ...data
    };
};

export const store = async (body,token) => {

    const response = await fetch(`${url}/users`, {
        method:'POST',
        headers:{
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })

    return await response.json()
}

export const destroy = async (id, token) => {
    const response = await fetch(`${url}/users/${id}?_method=DELETE`, {
        method: "POST",
        headers: {
            Accept:  'application/json',
            Authorization: `Bearer ${token}`
        }
    })

    return await response.json()
}

export const update = async (body, id, token) => {
    const response = await fetch(`${url}/users/${id}?_method=PATCH`, {
        method:'POST',
        headers:{
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })

    return await response.json()
}
export const Userestore = async (id, token) => {
    const response = await fetch(`${url}/users/restore/${id}`, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": 'application/json',
            Authorization: `Bearer ${token}`
        }
    });

    return await response.json();
}

export const Usersoftdelete = async (id, token) => {
    const response = await fetch (`${url}/users/${id}/soft-delete`,{
        method: 'POST',
        headers:{
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        }
    })

    return await response.json()
}

