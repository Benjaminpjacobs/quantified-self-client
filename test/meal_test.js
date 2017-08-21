const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM(`<!DOCTYPE html>`);
const $ = require('jQuery')(window);
const pry = require('pryjs')

const assert = require('chai').assert
const webdriver = require('selenium-webdriver');
const Meal = require("../lib/meal.js")
const until = webdriver.until;
const frontEndLocation = "http://localhost:8080"

describe('test meal object', function() {
    const meal = new Meal({
        "id": 1,
        "name": "Breakfast",
        "foods": [
            { "id": 4, "name": "Grapes", "calories": 180 },
            { "id": 6, "name": "Yogurt", "calories": 550 },
            { "id": 7, "name": "Macaroni and Cheese", "calories": 950 }
        ]
    })

    const table = $(`<div class='meal-tables' id='meals'>
    <div class='meal' id='breakfast'>
        <h1>Breakfast:</h1>
        <div class=''>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Food</th>
                        <th>Calorie</th>
                    </tr>
                </thead>
                <tbody class='meal-items' id='breakfast-items'>
                    <tr>
                        <td><b>Goal Calories:</b></td>
                        <td class='goal-calories' id='breakfast-goal-calories'></td>
                    </tr>
                    <tr>
                        <td><b>Total Calories:</b></td>
                        <td class='total-calories' id='breakfast-total-calories'></td>
                    </tr>
                    <tr>
                        <td><b>Remaining Calories:</b></td>
                        <td class='remaining-calories' id='breakfast-remaining-calories'></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>`)

    it('should meal info and food info', function() {
        assert.equal(meal.id, 1)
        assert.equal(meal.name, 'Breakfast')
        assert(Array.isArray(meal.foods));
        assert.equal(meal.foods.length, 3)
        assert.equal(meal.total, 1680)
    })

    it('should populate table', function() {
        let mealIndex = {
            index: table.find('#breakfast-items'),
            calories: table.find('#breakfast-total-calories'),
            goalCalories: table.find('#breakfast-goal-calories'),
            remainingCal: table.find('#breakfast-remaining-calories'),
            target: 400
        }
        meal.populateTable(mealIndex)
        assert.equal(mealIndex.index.find('.food').length, 3)
        assert.equal(mealIndex.calories.text(), 1680)
        assert.equal(mealIndex.goalCalories.text(), 400)
        assert.equal(mealIndex.remainingCal.text(), -1280)

    })

})