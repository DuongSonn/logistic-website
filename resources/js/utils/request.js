import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api", // Set your API base URL here
    // You can add more Axios configuration options here if needed
});

export function get(url, params = {}) {
    return axiosInstance.get(url, { params });
}

export function post(url, data = {}) {
    return axiosInstance.post(url, data);
}

export function put(url, data = {}) {
    return axiosInstance.put(url, data);
}
