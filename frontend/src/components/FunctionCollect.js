import { HOST_NAME } from "./config";

export function TryLog(props) {
  console.log(props)
}

//Call Api (function to connect backend)
export function callApi( path, method, data ) {
  return new Promise((resolve, reject) => {
    const info = {
      method,
      header:{
        'Content-type': 'application/json'
      },
      body: data ? JSON.stringify(data) : undefined
    };
    // console.log(path)
    // console.log(info)
    fetch(HOST_NAME + path, info)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          reject(data.error)
        } else {
          resolve(data)
        }
      })
      .catch(err => console.log(err))
  })
}