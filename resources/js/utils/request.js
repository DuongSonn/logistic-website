import axios from "axios";
import { setLocalStorageItem } from "./auth";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api", // Set your API base URL here
    // You can add more Axios configuration options here if needed
});

export function get(url, params = {}, headers = {}) {
    return axiosInstance.get(url, {
        params,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
    });
}

export function post(url, data = {}, headers = {}) {
    return axiosInstance.post(url, data, {
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
    });
}

export function put(url, data = {}, headers = {}) {
    return axiosInstance.put(url, data, {
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
    });
}
