import history from './history';
import jwt from 'jsonwebtoken';
export default class Auth {
    // Please use your own credentials here
    onLogin = (loginResponse) => {
        let expiresAt = (Number(loginResponse.expiresIn) + new Date().getTime()).toString();
        localStorage.setItem('x-access-token', loginResponse.token);
        localStorage.setItem('user', JSON.stringify(loginResponse.user));
        localStorage.setItem('expiresAt', expiresAt);
    }

    // removes user details from localStorage
    onLogout = () => {
        // Clear access token and ID token from local storage
        localStorage.removeItem('x-access-token');
        localStorage.removeItem('user');
        localStorage.removeItem('expiresAt');
        // navigate to the home route
        history.push('/');
    }

    // checks if the user is authenticated
    isAuthenticated = () => {
        // Check whether the current time is past the
        // access token's expiry time
        let expiresAt = Number(localStorage.getItem('expiresAt') || 0);
        let userObject = localStorage.getItem('user') === "undefined" ? null : localStorage.getItem('user');
        userObject = JSON.parse(userObject || "{}");
        let token = localStorage.getItem('x-access-token') === "undefined" ? null : localStorage.getItem('x-access-token');
        let decodedContent = jwt.decode(token) || {};
        return (decodedContent.userId === userObject.userId && !!userObject.userId && new Date().getTime() < expiresAt);
    }

    getUser = () => {
        let userObject = localStorage.getItem('user') === "undefined" ? null : localStorage.getItem('user');
        userObject = JSON.parse(userObject || "{}");
        return userObject;
    }

    setHeaders = (headers) => {
        if (this.isAuthenticated()) {
            headers['x-access-token'] = localStorage.getItem('x-access-token');
        }
        return headers;
    }
}