export function cacheUserToken(token) {
    return token
        ? localStorage.setItem("userToken", JSON.stringify(token))
        : localStorage.removeItem("userToken");
}

export function getUserToken() {
    let token;
    try {
        token = JSON.parse(localStorage.getItem("userToken"));
    } catch (e) {
        token = {username: null, token: ''}
    }
    return token?token:{username: null, token: ''};
}