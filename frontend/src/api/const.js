const HOST=import.meta.env.VITE_BACKEND_LINK;

export const AUTH_ROUTES=`${HOST}/api`;
export const SIGNUP_ROUTE=`${AUTH_ROUTES}/signup`
export const LOGIN_ROUTE=`${AUTH_ROUTES}/login`
export const CHECK_ROUTE=`${AUTH_ROUTES}/check`
// export const GET_USER_INFO=`${AUTH_ROUTES}/user-info`