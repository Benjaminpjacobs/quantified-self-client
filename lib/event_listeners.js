const $ = require('jquery');
const Food = require('./food')
const Meal = require('./meal')
const MealTableVariables = require('./meal_table_variables')
const TableNodes = require('./table_nodes')
const GrandTotalNodes = require('./grand_total_nodes')
const Handlers = require('./event_handlers')
const Populator = require('./populator')

$(document).ready(function() {
    const $foodIndex = $('#food-index')
    const $foodSearch = $('#food-search')
    const $foodSort = $('#food-sort')
    const $foodSubmit = $('#submit')
    const $mealButtons = $('.meal-button')
    const $mealTables = $('.meal-tables')

    const populatePage = new Populator

    const foodUpdaters = [{ heading: "name", update: Handlers.updateFoodName }, { heading: "cal", update: Handlers.updateFoodCal }]

    foodUpdaters.forEach(data => {
        $foodIndex.on('click', `.food .editable.food-${data.heading}`, data.update)
    })

    $foodSubmit.on('click', Handlers.submitFood)

    $foodIndex.on('click', '.delete', Handlers.deleteConfirmationPopup)

    $foodIndex.on('click', '.confirm-delete button', Handlers.confirmOrCancelDelete)

    $mealTables.on('click', '.delete', Handlers.deleteFoodFromMeal)

    $mealButtons.on('click', (e) => { Handlers.addFoodToMealsTable(e, $('.add-food-check input:checked')) })

    $foodSearch.on('keyup', (e) => { Handlers.filterFoods(e, $('.food-index tr')) })

    $foodSort.on('click', (e) => { Handlers.sorterFunction(e, $('.calorie-heading')) })
})