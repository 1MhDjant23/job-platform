import axios from "axios";


let _accessToken: string | null = null;


export const    getAccessToken = () : string|null => _accessToken;
export const    setAccessToken = (token: string | null): void => {_accessToken = token;};



export  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// attach token in request header

api.interceptors.request.use(
    (config) => {
        console.log("###### ", import.meta.env.VITE_API_URL)
        const   token = getAccessToken();
        if(token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error) => Promise.reject(error)
)

// after every response handles 401 -> silent refresh -> retry original request

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const   original = error.config; // that the request that failed
        const   is401 = error.response?.status === 401;
        const   notRetried = !original._retry;
        const   notRefresh = !original.url?.includes('/auth/refresh');
        console.log("In response interceptor: ", original.url.includes('/auth/refresh'));

        if(is401 && notRefresh && notRetried) {
            original._retry = true; // don't retry again
            try {
                const   {data} = await api.get('/auth/refresh');
                const   newToken = data.data.accessToken;
                setAccessToken(newToken);
                original.headers.Authorization = `Bearer ${newToken}`;
                //retry the original request
                return api(original);
            } catch {
                // refresh token also expired
                setAccessToken(null);
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }
        // not 401 or already retried
        return Promise.reject(error);
    }
);