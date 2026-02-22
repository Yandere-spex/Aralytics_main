// frontend/src/services/alphabetService.js

export const getAllLetters = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:5000/api/alphabet', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    return data.data;
};

export const getLetterByChar = async (letter) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:5000/api/alphabet/${letter}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    return data.data;
};

export const incrementPlayCount = async (letter) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:5000/api/alphabet/${letter}/play`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    return data.data;
};