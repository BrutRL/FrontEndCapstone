import {url} from "./configuration";


export const index = async (token) => {

    const response = await fetch(`${url}/schedules`, {
        method:'GET',
        headers:{
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
    })

    return await response.json()
}

export const scheduleArchieve = async (token) => {
    const response = await fetch(`${url}/schedules/archive`, {
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

    const response = await fetch(`${url}/schedules`, {
        method:'POST',
        headers:{
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })

    return response
}

export const destroy = async (id, token) => {
    const response = await fetch(`${url}/schedules/${id}?_method=DELETE`, {
        method: "POST",
        headers: {
            Accept:  'application/json',
            Authorization: `Bearer ${token}`
        }
    })

    return await response.json()
}

export const update = async (body, id, token) => {
    const response = await fetch(`${url}/schedules/${id}?_method=PATCH`, {
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

/*export const accessRoom = async (body, id, token) => {
    const response = await fetch(`${url}/schedules/${id}?_method=PATCH`, {
        method:'POST',
        headers:{
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })

    return await response.json()
} */