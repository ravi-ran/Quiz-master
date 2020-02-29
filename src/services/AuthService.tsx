class Auth {
    authenticated: boolean;
    constructor() {
        this.authenticated = false;
    }

    authenticate(cb: Function) {
        this.authenticated = true;
        cb();
    }

    deAuthenticate(cb: Function) {
        this.authenticated = false;
        cb();
    }

    isAuthenticated() {
        return this.authenticated;
    }
}

export default new Auth();