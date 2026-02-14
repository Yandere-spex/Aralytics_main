// frontend/src/services/storyService.js
export const getAllStories = async () => {
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:5000/api/stories', {
        headers: {
        'Authorization': `Bearer ${token}`
        }
    });
    
    const data = await response.json();
    return data.data;
    };

    export const getStoryById = async (id) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`http://localhost:5000/api/stories/${id}`, {
        headers: {
        'Authorization': `Bearer ${token}`
        }
    });
    
    const data = await response.json();
    return data.data;
};