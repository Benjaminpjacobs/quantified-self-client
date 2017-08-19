const $ = require('jquery');
const Food = require('./food')
const Meal = require('./meal')

let target = 5000
let bfastTarget = 600
let lunchTarget = 400
let snackTarget = 200
let dinnerTarget = 800


$(document).ready(function() {
    const $newFoodName = $('#new-food-name')
    const $newFoodCalories = $('#new-food-cal')
    const $foodSubmit = $('#submit')
    const $foodIndex = $('#food-index')
    const $diaryFoodIndex = $('#diary-food-index')
    const $bfastIndex = $('#breakfast-items')
    const $lunchIndex = $('#lunch-items')
    const $snackIndex = $('#snack-items')
    const $dinnerIndex = $('#dinner-items')
    const $brfastCal = $('#breakfast-total-calories')
    const $lunchCal = $('#lunch-total-calories')
    const $snackCal = $('#snack-total-calories')
    const $dinnerCal = $('#dinner-total-calories')
    const $brfastRemainingCal = $('#breakfast-remaining-calories')
    const $lunchRemainingCal = $('#lunch-remaining-calories')
    const $snackRemainingCal = $('#snack-remaining-calories')
    const $dinnerRemainingCal = $('#dinner-remaining-calories')
    const $totalCal = $('#total-calories')
    const $remainingCal = $('#remaining-calories')
    const $goalCal = $('#goal-calories')
    const $mealButtons = $('.meal-button')


    Food.getFoods()
        .then(function(response) {
            return response.map(function(food) {
                return new Food(food)
            })
        })
        .then(function(foods) {
            foods.forEach(function(food) {
                $foodIndex.append(food.toHTML())
                $diaryFoodIndex.append(food.toDiaryHTML())
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
                        meal.mealCalories($brfastCal)
                        meal.mealCaloriesRemaining($brfastRemainingCal, bfastTarget)
                        break;
                    case "Lunch":
                        meal.appendToTable($lunchIndex)
                        meal.mealCalories($lunchCal)
                        meal.mealCaloriesRemaining($lunchRemainingCal, bfastTarget)
                        break;
                    case "Snack":
                        meal.appendToTable($snackIndex)
                        meal.mealCalories($snackCal)
                        meal.mealCaloriesRemaining($snackRemainingCal, bfastTarget)
                        break;
                    case "Dinner":
                        meal.appendToTable($dinnerIndex)
                        meal.mealCalories($dinnerCal)
                        meal.mealCaloriesRemaining($dinnerRemainingCal, bfastTarget)
                        break;
                }
            })
            return meals
        })
        .then(function(meals) {
            let total = meals.reduce(function(sum, meal) {
                return sum + meal.total
            }, 0)
            let remaining = target - total
            $totalCal.text(total)
            $remainingCal.text(remaining)
            $goalCal.text(target)
            if (remaining < 0) {
                $remainingCal.addClass('negative')
            } else {
                $remainingCal.removeClass('negative')
            }
        })

    $foodSubmit.on('click', function() {
        let food = {
            name: $newFoodName.val(),
            calories: $newFoodCalories.val()
        }
        Food.addNewFood(food, $foodIndex)
    })

    $foodIndex.on('click', '.delete', function(event) {
        var food = this.parentElement.parentElement
        var id = food.id
        Food.deleteFood(id)
            .then(function() {
                $(`#${id}`).fadeOut(300);
            })
    })

    $mealButtons.on('click', function(event) {
        debugger
    })

})