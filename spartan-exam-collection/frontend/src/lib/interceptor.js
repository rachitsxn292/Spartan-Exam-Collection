import axios from 'axios';
import Auth from './auth';
import * as constants  from './constants'
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
                method : options.method || "GET",
                url : options.url
            }).then((response) => {
                let data = response.data || {};
                if (data.result === "success") {
                    resolve(data)
                } else if (data.result === "failure") {
                    if (!!(data.response || {}).code) {
                        data.response = [data.response]
                    }
                    data.response = data.response || [{
                        code: "TOKENERROR"
                    }];
                    if (data.response[0].code === "TOKENERROR") {
                        // logout
                    } else {
                        reject({
                            result: "failure",
                            message: data.response[0].message || "Some Error with the Server"
                        });
                    }
                } else {
                    reject({
                        result: "failure",
                        message: "Some Error with the Server"
                    });
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