import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './App.css';

function App() {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);  

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setResponse(null);
        setIsLoading(true);  

        try {
            const parsedData = JSON.parse(input);
            if (!parsedData || !Array.isArray(parsedData.data)) {
                setError('Invalid JSON format');
                setIsLoading(false); 
                return;
            }

            const result = await axios.post('https://bajaj-backend-xonn.onrender.com/bfhl', parsedData);
            setResponse(result.data);
        } catch (err) {
            setError('An error occurred while fetching data.');
        } finally {
            setIsLoading(false);  
        }
    };

    const handleSelectChange = (selectedItems) => {
        setSelectedOptions(selectedItems.map(item => item.value));
    };

    const renderResponse = () => {
        if (!response) return null;

        const { numbers, alphabets, highest_lowercase_alphabet, is_success, user_id, email, roll_number } = response;
        const renderData = {};

        if (selectedOptions.includes('Numbers')) {
            renderData.numbers = numbers;
        }
        if (selectedOptions.includes('Alphabets')) {
            renderData.alphabets = alphabets;
        }
        if (selectedOptions.includes('Highest lowercase alphabet')) {
            renderData.highest_lowercase_alphabet = highest_lowercase_alphabet;
        }

        return (
            <div>
                <h2>Full Response:</h2>
                <pre>{JSON.stringify({ is_success, user_id, email, roll_number }, null, 2)}</pre>
                <h2>Filtered Response:</h2>
                <pre>{JSON.stringify(renderData, null, 2)}</pre>
            </div>
        );
    };

    const options = [
        { value: 'Alphabets', label: 'Alphabets' },
        { value: 'Numbers', label: 'Numbers' },
        { value: 'Highest lowercase alphabet', label: 'Highest lowercase alphabet' }
    ];

    return (
        <div className="App">
            <h1>BAJAJ</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    API Input:
                    <textarea
                        rows="4"
                        cols="50"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder='e.g. { "data": ["A", "C", "z"] }'
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
            {error && <p>{error}</p>}
            <Select
                options={options}
                isMulti
                onChange={handleSelectChange}
            />
            {isLoading ? <p>Loading...</p> : renderResponse()}  
        </div>
    );
}

export default App;
