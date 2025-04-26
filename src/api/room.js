import {url} from "./configuration";
//export const image = 'http://localhost:8000/storage/uploads/rooms/'

export const index = async () => {

    const response = await fetch(`${url}/rooms`, {
        method:'GET',
        headers:{
            Accept: "application/json",
        },
    })

    return await response.json()
}

export const store = async (body, token) => {
    const response = await fetch(`${url}/rooms` , {
        method:'POST',
        headers:{
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: body
    })

    return await response.json()
}

export const destroy = async (id, token) => {
    const response = await fetch(`${url}/rooms/${id}?_method=DELETE`, {
        method: "POST",
        headers: {
            Accept:  'application/json',
            Authorization: `Bearer ${token}`
        }
    })

    return await response.json()
}

export const update = async (body, id, token) => {
    const response = await fetch(`${url}/rooms/${id}?_method=PATCH`, {
      method: "POST", // Simulate PATCH with POST
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body, // Send FormData
    });
  
    return await response.json();
  };

export const accessRoom = async (body,token) => {

    const response = await fetch(`${url}/rooms`, {
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

export const updateRoomStatus = async (token) => {
    const response = await fetch(`${url}/rooms/update-status`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  
    return await response.json();
  };
  