const $ = require('jquery');
const Food = require('./food.js')
const API = "https://quantified-self-rails-backend.herokuapp.com/api/v1"

$(document).ready(function() {
    const $newFoodName = $('#new-food-name')
    const $newFoodCalories = $('#new-food-cal')
    const $foodSubmit = $('#submit')
    const $foodIndex = $('#food-index')

    Food.getFoods()
        .then(function(response) {
            return response.map(function(food) {
                return new Food(food)
            })
        }).then(function(foods) {
            foods.forEach(function(food) {
                $foodIndex.append(food.toHTML())
            })
        })

    const addNewFood = () => {
        const food = {
            name: $newFoodName.val(),
            calories: $newFoodCalories.val()
        }
        Food.postFood(food).then(function(response) {
            return new Food(response)
        }).then(function(food) {
            $foodIndex.append(food.toHTML())

        })
    }

    $foodSubmit.on('click', function() {
        addNewFood();
    })

})