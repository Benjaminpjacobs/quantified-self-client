const Meal = require("../../lib/meal.js")

module.exports = new Meal({
    "id": 1,
    "name": "Breakfast",
    "foods": [
        { "id": 4, "name": "Grapes", "calories": 180 },
        { "id": 6, "name": "Yogurt", "calories": 550 },
        { "id": 7, "name": "Macaroni and Cheese", "calories": 950 }
    ]
})