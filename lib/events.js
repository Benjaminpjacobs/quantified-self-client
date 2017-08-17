const $ = require('jquery');
const Food = require('./food')
const Meal = require('./meal')


$(document).ready(function() {
    const $newFoodName = $('#new-food-name')
    const $newFoodCalories = $('#new-food-cal')
    const $foodSubmit = $('#submit')
    const $foodIndex = $('#food-index')
    const $bfastIndex = $('#breakfast-items')
    const $lunchIndex = $('#lunch-items')
    const $snackIndex = $('#snack-items')
    const $dinnerIndex = $('#dinner-items')

    Food.getFoods()
        .then(function(response) {
            return response.map(function(food) {
                return new Food(food)
            })
        })
        .then(function(foods) {
            foods.forEach(function(food) {
                $foodIndex.append(food.toHTML())
            })
        })


    Meal.getMeals()
        .then(function(response) {
            return response.map(function(meal) {
                return new Meal(meal)
            })
        })
        .then(function(meals) {
            meals.forEach(function(meal) {
                switch (meal.name) {
                    case "Breakfast":
                        meal.appendToTable($bfastIndex)
                        break;
                    case "Lunch":
                        meal.appendToTable($lunchIndex)
                        break;
                    case "Snack":
                        meal.appendToTable($snackIndex)
                        break;
                    case "Dinner":
                        meal.appendToTable($dinnerIndex)
                        break;
                }
            })
        })

    $foodSubmit.on('click', function() {
        let food = {
            name: $newFoodName.val(),
            calories: $newFoodCalories.val()
        }
        Food.addNewFood(food, $foodIndex)
    })

})