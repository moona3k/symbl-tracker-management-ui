import { tokenKey, AUTH_URL } from '../config'

export const authenticateSymbl = ({ appId, appSecret }) => {
  return new Promise((resolve, reject) => {
    window
      .fetch(AUTH_URL, {
        method: "POST",
        body: JSON.stringify({
          type: "application",
          appId,
          appSecret,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.ok) resolve(response.json())
        reject(response)
      })
      .then((json) => {
        if (json.accessToken) {
          window.localStorage.setItem(tokenKey, json.accessToken);
          resolve(window.localStorage.getItem(tokenKey));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
