// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
    // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
    const authorityString =
        typeof str === 'undefined' ? localStorage.getItem('antd-pro-authority') : str;
    // authorityString could be admin, "admin", ["admin"]
    let authority;
    try {
        authority = JSON.parse(authorityString);
    } catch (e) {
        authority = authorityString;
    }
    if (typeof authority === 'string') {
        return [authority];
    }
    return authority;
}

export function setAuthority(authority) {
    authority = authority.replace("ROLE_","").toLowerCase();
    // if (authority === "ROLE_USER") authority = "user";
    // if (authority === "ROLE_ADMIN") authority = "admin";
    const proAuthority = typeof authority === 'string' ? [authority] : authority;
    return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}

export function setAuthorization(Authorization) {
    return localStorage.setItem("rt_token",Authorization);
}

export function getToken() {
    return localStorage.getItem("rt_token");
}