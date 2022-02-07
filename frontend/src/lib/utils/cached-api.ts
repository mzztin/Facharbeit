import axios from "axios";
import { setupCache } from "axios-cache-adapter";

const myCache = setupCache({
	maxAge: 3 * 1000
});

const api = axios.create({
	adapter: myCache.adapter,
    baseURL: "http://192.168.1.53:4000",
    withCredentials: true
});

export default api;