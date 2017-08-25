let target = 2000
let bfastTarget = 400
let lunchTarget = 600
let snackTarget = 200
let dinnerTarget = 800

const $ = require('jquery');
const Food = require('./food')
const Meal = require('./meal')
const MealTableVariables = require('./meal_table_variables')
const GrandTotalNodes = require('./grand_total_nodes')

const $foodIndex = $('#food-index')
const $diaryFoodIndex = $('#diary-food-index')
const mealTableVariables = new MealTableVariables({
    breakfast: bfastTarget,
    lunch: lunchTarget,
    snack: snackTarget,
    dinner: dinnerTarget
})
const grandTotals = new GrandTotalNodes($('#meals'))


class Populator {
    constructor() {
        Food.getAll()
            .then(function(response) {
                return Food.mapObjects(response)
            })
            .then(function(foods) {
                Food.appendFoods(foods, $foodIndex, $diaryFoodIndex)
            })

        if ($('#diary-food-index').length !== 0) {
            Meal.getAll()
                .then(function(response) {
                    return response.map(function(meal) {
                        return new Meal(meal)
                    })
                })
                .then(function(meals) {
                    Meal.populateAllTables(meals, mealTableVariables)
                })
                .then(function() {
                    Meal.updateGrandTotal(target, grandTotals)
                })
        }

    }
}

module.exports = Populator