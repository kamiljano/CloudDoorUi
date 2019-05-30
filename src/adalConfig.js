import { AuthenticationContext, adalFetch, withAdalLogin } from 'react-adal';
 
export const adalConfig = {
  tenant: "d5c08352-b4fe-4bbe-97c8-5f577bd03063", //process.env.REACT_APP_AAD_TENANT,
  clientId: '8beba41e-e4b3-4e8a-b694-982522d53a3a',//process.env.REACT_APP_AAD_CLIENT_ID,
  postLogoutRedirectUri: window.location.origin,
  endpoints: {
    api: 'https://graph.microsoft.com'//process.env.REACT_APP_OBJECT_ID
  },
  cacheLocation: 'localStorage',
};
 
export const authContext = new AuthenticationContext(adalConfig);
 
export const adalApiFetch = (fetch, url, options) =>
  adalFetch(authContext, adalConfig.endpoints.api, fetch, url, options);
 
export const withAdalLoginApi = withAdalLogin(authContext, adalConfig.endpoints.api);