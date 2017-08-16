require('./style.scss')
const $ = require('jquery');
const Food = require('./javascripts/food.js')
const API = "https://quantified-self-rails-backend.herokuapp.com/api/v1"

$(document).ready(function() {
    const $newFoodName = $('#new-food-name')
    const $newFoodCalories = $('#new-food-cal')
    const $foodSubmit = $('#submit')
    const $foodIndex = $('#food-index')

    const addFoodRow = (food) => {
        let row = `<tr id=${food.id}>
                  <td>${food.name}</td>
                  <td>${food.calories}</td>
                  <td class='delete-food'>
                    <span class='glyphicon glyphicon-remove-circle'>
                    </span>
                    </td>
                </tr>`
        $foodIndex.append(row)
    }

    const populateTable = () => {
        $.getJSON(API + '/foods', function(data) {
            $.each(data, function(key, value) {
                addFoodRow(value)
            })
        })
    }

    const createFood = (food) => {
        $.post(API + `/foods?food[name]=${food.name}&food[calories]=${food.calories}`, function(data) {
            debugger
        })
    }

    const addNewFood = () => {
        const food = new Food($newFoodName.val(), $newFoodCalories.val())
        createFood(food);
        debugger
        addFoodRow(food);
    }

    $foodSubmit.on('click', function() {
        addNewFood();
    })

    populateTable();
})