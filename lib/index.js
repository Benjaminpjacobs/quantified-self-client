const $ = require('jquery');
const Food = require('./food.js')
const API = "https://quantified-self-rails-backend.herokuapp.com/api/v1"
$(document).ready(function() {

    const foodIndex = $('#food-index')

    const addFoodRow = (food) => {
        let row = `<tr id=${food.id}>
                  <td>${food.name}</td>
                  <td>${food.calories}</td>
                  <td class='delete-food'>Delete</td>
                </tr>`
        foodIndex.append(row)
    }

    const getApiData = () => {
        $.getJSON(API + '/foods', function(data) {
            $.each(data, function(key, value) {
                addFoodRow(value)
            })
        })
    }

    getApiData();
})