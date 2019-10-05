import axios from 'axios';

export const loginUser = async (loginInfo) => {
    return await axios.put('/api/login', loginInfo); 
}