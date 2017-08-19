const assert = require('chai').assert;
const webdriver = require('selenium-webdriver');
const Meal = require("../lib/meal.js")
const until = webdriver.until;
const frontEndLocation = "http://localhost:8080"

describe('test meal object', function() {
    it('should meal info and food info', function() {
        const meal = new Meal({
            "id": 1,
            "name": "Breakfast",
            "foods": [
                { "id": 4, "name": "Grapes", "calories": 180 },
                { "id": 6, "name": "Yogurt", "calories": 550 },
                { "id": 7, "name": "Macaroni and Cheese", "calories": 950 }
            ]
        })
        assert.equal(meal.id, 1)
        assert.equal(meal.name, 'Breakfast')
        assert(Array.isArray(meal.foods));
        assert.equal(meal.foods.length, 3)
        assert.equal(meal.total, 1680)
    })

})