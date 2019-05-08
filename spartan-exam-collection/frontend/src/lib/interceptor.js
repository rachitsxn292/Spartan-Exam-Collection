import axios from 'axios';
import Auth from './auth';
import * as constants from './constants'
const auth = new Auth();
export default class API {
    call = (options) => {
        return new Promise((resolve, reject) => {
            if (!options.url || !options.method) {
                reject({
                    result: "failure",
                    message: "Some Error with the Server"
                });
                return;
            }
            options.url = `${constants.projectServer}${options.url}`;
            axios({
                params: options.query || {},
                headers: options.headers || {},
                data: options.data || {},
                method: options.method || "GET",
                url: options.url
            }).then((response) => {
                let data = response.data || {};
                if (data.result === "success") {
                    resolve(data)
                } else {
                    reject(data)
                }
            }).catch((err) => {
                reject({
                    result: "failure",
                    message: "Some Error with the Server"
                });
                return;
            });
        });
    }
}