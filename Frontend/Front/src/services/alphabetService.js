const API_URL = 'http://localhost:5000/api/alphabet';

export const getAllLetters = async () => {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching letters:', error);
        throw error;
    }
};

    export const getLetterByLetter = async (letter) => {
    try {
        const response = await fetch(`${API_URL}/${letter}`);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching letter:', error);
        throw error;
    }
};