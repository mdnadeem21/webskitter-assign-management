import axios from 'axios';


// create an axios instance with default configuration
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api', // replace with your backend API base URL
    withCredentials: true, // send cookies with requests

});

export default axiosInstance;