require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware to parse JSON bodies
app.use(express.json());

// Fruits endpoint
app.get('/fruits', async (req, res) => {
    try {
        const response = await axios.get('https://www.fruityvice.com/api/fruit/all');
        
        // Transform the data to include only essential information
        const fruitsData = response.data.map(fruit => ({
            name: fruit.name,
            family: fruit.family,
            genus: fruit.genus,
            nutritions: {
                calories: fruit.nutritions.calories,
                protein: fruit.nutritions.protein,
                carbohydrates: fruit.nutritions.carbohydrates,
                fat: fruit.nutritions.fat,
                sugar: fruit.nutritions.sugar
            }
        }));

        res.json(fruitsData);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching fruits data' });
    }
});

// Root endpoint
app.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://www.fruityvice.com/api/fruit/all');
        const fruitsData = response.data.map(fruit => ({
            name: fruit.name,
            family: fruit.family,
            genus: fruit.genus,
            nutritions: {
                calories: fruit.nutritions.calories,
                protein: fruit.nutritions.protein,
                carbohydrates: fruit.nutritions.carbohydrates,
                fat: fruit.nutritions.fat,
                sugar: fruit.nutritions.sugar
            }
        }));
        
        res.render('index', { fruits: fruitsData });
    } catch (error) {
        res.status(500).render('index', { fruits: [], error: 'Error fetching fruits data' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 