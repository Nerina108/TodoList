import cookie from 'js-cookie';

// Set cookie
const setCookie = (key, value) => {
    if (window !== "undefined") {
        cookie.set(key, value, {
            expires: 1
        })
    }
}

// Remove from cookie on signout
const removeCookie = (key) => {
    if (window !== "undefined") {
        cookie.remove(key, {
            expires: 1
        })
    }
}

// get from cookie such as stored token - will be useful when we need to make request to server with token
const getCookie = (key) => {
    if (window !== "undefined") {
        return cookie.get(key)
    }
}

// set localstorage
const setLocalStorage = (key, value) => {
    if (window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(value))
    }
}

// remove from localstorage
const removeLocalStorage = (key) => {
    if (window !== "undefined") {
        localStorage.removeItem (key)
    }
}

// authenticate user by passing data to cookie and localStorage during signin
const authenticate = (response, next) => {
    setCookie('token', response.data.token)
    setLocalStorage('user', response.data.user)
    next();
}

// access user information from localStorage
const isAuth = () => {
    if (window !== "undefined") {
        // Grab the cookie
        const cookieChecked = getCookie('token');

        if (cookieChecked) {
            if(localStorage.getItem('user')) {
                return JSON.parse(localStorage.getItem('user'))
            } else {
                return false
            }
        }
    }
}

const signout = next => {
    removeCookie('token')
    removeLocalStorage('user')
    next()
}

const updateUser = (response, next) => {

    if (typeof window !== 'undefined') {
        let auth = JSON.parse(localStorage.getItem('user'));
        auth = response.data
        localStorage.setItem('user', JSON.stringify(auth));
    }
    next();
}

export {
    setCookie, 
    removeCookie, 
    getCookie, 
    setLocalStorage,
    removeLocalStorage,
    authenticate,
    isAuth,
    signout,
    updateUser
}
    