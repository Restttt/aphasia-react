import axios from 'axios';

export const submitFile = async (formData) => {
    return await axios.put('/api/submit', formData); 
}