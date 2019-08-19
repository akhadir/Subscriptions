import axios from 'axios';
import querystring from 'query-string';
const FetchSub = {
    // queryBaseURL: "/api/?db=epiz-24335607-milk&",
    // queryBaseURL: "http://amruthamilk.epizy.com/api/?db=epiz-24335607-milk&",
    queryBaseURL: "http://khadir.dx.am/api/?db=2461352-milk&",
    getUserDetails (data = null) {
        var promise = new Promise((resolve, reject) => {
            if (!data) {
                data = window.localStorage.getItem("Milk.Subscriptions");
            }
            if (data && data !== "undefined") {
                let jData = JSON.parse(data);
                if (jData) {
                    if (!jData.Id) {
                        let url = `${FetchSub.queryBaseURL}table=User&column=Phone&value=${jData.Phone}`;
                        AxiosWrapper.get(url).then((resp) => {
                            let udata = resp.data;
                            if (udata && udata[0].Id) {
                                window.localStorage.setItem("Milk.Subscriptions", JSON.stringify(udata[0]));
                                resolve(jData);
                            } else {
                                resolve('');
                            }
                        });
                    } else {
                        resolve(jData);
                    }
                } else {
                    resolve(jData);
                }
            } else {
                resolve('');
            }
        });
        return promise;
    },
    getProductDetails () {
        var promise = new Promise((resolve, reject) => {
            let url = `${FetchSub.queryBaseURL}table=Product`;
            AxiosWrapper.get(url).then((resp) => {
                resolve(resp.data);
            }).catch(() => {
                resolve('');
            });
        });
        return promise;
    },
    getUserProductDetails () {
        var promise = new Promise((resolve, reject) => {
            Promise.all([FetchSub.getUserDetails(), FetchSub.getProductDetails()]).then((data) => {
                resolve(data);
            });
        });
        return promise;
    },
    deleteSubscription(id) {
        var promise = new Promise((resolve, reject) => {
            let url = `${FetchSub.queryBaseURL}table=Subscription&column=Id&value=${id}`;
            AxiosWrapper.delete(url).then((resp) => {
                if (!resp['error']) {
                    resolve(resp['data']);
                } else {
                    resolve('');
                }
            }).catch(() => {
                resolve('');
            });
        });
        return promise;
    },
    getOrders (id, date) {
        var promise = new Promise((resolve, reject) => {
            let url = `${FetchSub.queryBaseURL}table=UserOrder&column=UserId&value=${id}&column1=Date&value1=${date}`;
            AxiosWrapper.get(url).then ((res) => {
                if (!res['error']) {
                    let data = res['data'];
                    resolve(data);
                }
            });
        });
        return promise;
    },
    register (data) {
        var promise = new Promise((resolve, reject) => {
            let url = `${FetchSub.queryBaseURL}table=User`;
            AxiosWrapper.post(url, data).then ((res) => {
                if (!res['error'] && res['data'] === '') {
                    window.localStorage.setItem("Milk.Subscriptions", JSON.stringify(data));
                    FetchSub.getUserProductDetails().then(resp => {
                        resolve(resp);
                    });
                }
            });
        });
        return promise;
    },
    getSubscriptions (id) {
        var promise = new Promise((resolve, reject) => {
            let url = `${FetchSub.queryBaseURL}table=Subscription&column=UserId&value=${id}`;
            AxiosWrapper.get(url).then ((res) => {
                if (!res['error']) {
                    let data = res['data'];
                    data = data.map((item) => {
                        item['Details'] = item['Details'].split(',');
                        return item;
                    });
                    resolve(data);
                }
            });
        });
        return promise;
    },
    saveSubscription(data) {
        var promise = new Promise((resolve, reject) => {
            data['Details'] = data['Details'].toString();
            let url = `${FetchSub.queryBaseURL}table=Subscription`;
            if (!data['Id']) {
                AxiosWrapper.post(url, data).then ((res) => {
                    if (!res['error']) {
                        resolve(res['data']);
                    }
                });
            } else {
                url += `&column=Id&value=${data['Id']}`;
                if (!data['PausedFrom']) {
                    data['PausedFrom'] = 'Null';
                }
                if (!data['PausedTo']) {
                    data['PausedTo'] = 'Null';
                }
                AxiosWrapper.put(url, data).then ((res) => {
                    if (!res['error']) {
                        resolve(res['data']);
                    }
                });
            }
        });
        return promise;
    },
    throwError (msg, resolve) {
        AxiosWrapper.errorCallback(msg);
        resolve({error: msg});
    },
    handleError (callback) {
        AxiosWrapper.errorCallback = callback;
    }
}
export default FetchSub;
let AxiosWrapper = {
    errorCallback: null,
    init(callback) {
        AxiosWrapper.errorCallback = callback;
    },
    addSessionHeader: (config = {}) => {
        let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        config = {
            headers: headers
        }
        return config;
    },
    get: (url, config = undefined) => {
        let newConfig = AxiosWrapper.addSessionHeader(config);
        let promise = new Promise((resolve, reject) => {
            axios.get.call(this, url, newConfig).then((data)=> {
                resolve(data);
            }).catch((error) => {
                AxiosWrapper.handleError(error, resolve);
            });
        });
        return promise;
    },
    delete: (url, config = undefined) => {
        let newConfig = AxiosWrapper.addSessionHeader(config);
        let promise = new Promise((resolve, reject) => {
            axios.delete.call(this, url, newConfig).then((data)=> {
                resolve(data);
            }).catch((error) => {
                AxiosWrapper.handleError(error, resolve);
            });
        });
        return promise;
    },
    post:  (url, data, config = undefined) => {
        let newConfig = AxiosWrapper.addSessionHeader(config);
        let promise = new Promise((resolve, reject) => {
            axios.post.call(this, url, querystring.stringify(data), newConfig).then((data)=> {
                resolve(data);
            }).catch((error) => {
                AxiosWrapper.handleError(error, resolve);
            });
        });
        return promise;
    },
    put:  (url, data = undefined, config = undefined) => {
        let newConfig = AxiosWrapper.addSessionHeader(config);
        let promise = new Promise((resolve, reject) => {
            axios.put.call(this, url, querystring.stringify(data), newConfig).then((data)=> {
                resolve(data);
            }).catch((error) => {
                AxiosWrapper.handleError(error, resolve);
            });
        });
    return promise;
    },

    handleError: function (error, resolve) {
        // console.log(error);
        let msg = "";
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response['data']);
            console.log(error.response.status);
            console.log(error.response.headers);
            msg = error.response.status;
            if (error.response['data']) {
                let data = error.response['data'];
                if (data.errorMessage) {
                    msg = error.response['data'].errorMessage;
                } else if (data.localizedErrorSummary) {
                    msg = error.response['data'].localizedErrorSummary;
                } else if (data.errorSummary) {
                    msg = error.response['data'].errorSummary;
                }
                console.log(data);
            }
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
            msg = "No Response";
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
            msg = "No Response";
            if (!error) {
                error = {errorMessage: msg};
            } else if (error.message) {
                msg = error.message;
            }
        }
        //console.log(error.config);
        if (AxiosWrapper.errorCallback) {
            AxiosWrapper.errorCallback(msg)
        }
        resolve({data: {}, error: error});
    }
}