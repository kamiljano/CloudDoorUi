import { AuthenticationContext, runWithAdal } from 'react-adal';
 
const adalConfig = {
  tenant: process.env.REACT_APP_AAD_TENANT,
  clientId: process.env.REACT_APP_AAD_CLIENT_ID,
  postLogoutRedirectUri: window.location.origin,
  endpoints: {
    api: process.env.REACT_APP_AAD_API_ENDPOINT
  },
  cacheLocation: 'localStorage',
};
 
const authContext = new AuthenticationContext(adalConfig);

export const getToken = () => {
  return authContext.getCachedToken(authContext.config.clientId);
};

export const adalApiFetch = (url, options) => {
  const opt = {...options};
  opt.headers = opt.headers || {};
  opt.headers['Authorization'] = `Bearer ${getToken()}`;
  return fetch(url, opt);
};

export const logOut = () => authContext.logOut();

export const runAuthenticated = pageFun => {
  runWithAdal(authContext, pageFun, false);
}

export const getUser = () => {
  return new Promise((resolve, reject) => {
    authContext.getUser((err, user) => {
      err ? reject(err) : resolve(user);
    });
  });
};