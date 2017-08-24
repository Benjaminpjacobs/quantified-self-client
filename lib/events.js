const $ = require('jquery');
const Food = require('./food')
const Meal = require('./meal')
const MealTableVariables = require('./meal_table_variables')
const TableNodes = require('./table_nodes')
const GrandTotalNodes = require('./grand_total_nodes')
const Handlers = require('./event_handlers')
const Populator = require('./populator')

let target = 2000
let bfastTarget = 400
let lunchTarget = 600
let snackTarget = 200
let dinnerTarget = 800



$(document).ready(function() {
    const $foodIndex = $('#food-index')
    const $diaryFoodIndex = $('#diary-food-index')
    const mealTableVariables = new MealTableVariables({
        breakfast: bfastTarget,
        lunch: lunchTarget,
        snack: snackTarget,
        dinner: dinnerTarget
    })
    const grandTotals = new GrandTotalNodes($('#meals'))

    const $foodSearch = $('#food-search')
    const $foodSort = $('#food-sort')
    const $foodSubmit = $('#submit')
    const $mealButtons = $('.meal-button')
    const $mealTables = $('.meal-tables')

    const populate = new Populator


    // Food.getAll()
    //     .then(function(response) {
    //         return Food.mapObjects(response)
    //     })
    //     .then(function(foods) {
    //         Food.appendFoods(foods, $foodIndex, $diaryFoodIndex)
    //     })

    // if ($('#diary-food-index').length !== 0) {
    //     Meal.getAll()
    //         .then(function(response) {
    //             return response.map(function(meal) {
    //                 return new Meal(meal)
    //             })
    //         })
    //         .then(function(meals) {
    //             Meal.populateAllTables(meals, mealTableVariables)
    //         })
    //         .then(function() {
    //             Meal.updateGrandTotal(target, grandTotals)
    //         })
    // }

    //     [{ category: "name", update: Food.updateName }, { category: "calories", update: Food.updateName }].forEach(data => {
    //     $foodIndex.on('click', `.food .editable.food-${attr.cat}`, callBack(data.update))
    // })


    $foodIndex.on('click', '.food .editable.food-name', Handlers.updateFoodName)

    $foodIndex.on('click', '.food .editable.food-cal', Handlers.updateFoodCal)

    $foodSubmit.on('click', Handlers.submitFood)

    $foodIndex.on('click', '.delete', (e) => { Handlers.deleteFoodFromIndex(e, $('.confirm-delete')) })

    // $mealButtons.on('click', addFoodToMealsTable($('.add-food-check input:checked')))

    $mealButtons.on('click', (e) => { Handlers.addFoodToMealsTable(e, $('.add-food-check input:checked')) })

    $mealTables.on('click', '.delete', (e) => { Handlers.deleteFoodFromMeal(e) })

    $foodSearch.on('keyup', (e) => { Handlers.filterFoods(e, $('.food-index tr')) })

    $foodSort.on('click', (e) => { Handlers.sorterFunction(e, $('.calorie-heading')) })
})