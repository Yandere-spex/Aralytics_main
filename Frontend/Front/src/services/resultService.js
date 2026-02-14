// frontend/src/services/resultService.js
export const saveResult = async (resultData) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:5000/api/results', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(resultData)
    });
    
    const data = await response.json();
    return data.data;
};