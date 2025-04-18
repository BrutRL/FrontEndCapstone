import {url} from "./configuration";

export const index = async (token) => {
    const response = await fetch(`${url}/courses` , {
        method:'GET',
        headers:{
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
    })

    return await response.json()
}


export const store = async (body,token) => {

    const response = await fetch(`${url}/courses`, {
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

/*export const store = async (body, token) => {
    const response = await fetch(`${url}/courses` , {
        method:'POST',
        headers:{
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: body
    })

    return await response.json()
}
*/



export const courseArchive = async (token) => {
    const response = await fetch(`${url}/courses/archive`, {
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



export const destroy = async (id, token) => {
    const response = await fetch (`${url}/courses/${id}?_method=DELETE`,{
        method: 'POST',
        headers:{
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        }
    })

    return await response.json()
}

export const Coursesoftdelete = async (id, token) => {
    const response = await fetch (`${url}/courses/${id}/soft-delete`,{
        method: 'POST',
        headers:{
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        }
    })

    return await response.json()
}



export const update = async (body,id, token) => {
    const response = await fetch (`${url}/courses/${id}?_method=PATCH`,{
        method: 'POST',
        headers:{
            Accept: "application/json",
            "Content-Type": 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })

    return await response.json()
}
export const Courserestore = async (id, token) => {
    const response = await fetch(`${url}/courses/restore/${id}`, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": 'application/json',
            Authorization: `Bearer ${token}`
        }
    });

    return await response.json();
}
