const $ = require('jquery');
const Food = require('./food')
const API = "https://quantified-self-rails-backend.herokuapp.com/api/v1"

class Meal {
    constructor(meal) {
        this.id = meal.id
        this.name = meal.name
        this.foods = meal.foods.map(function(food) {
            return new Food(food)
        })
    }
    static getMeals() {
        return $.getJSON(API + '/meals')
    }

    appendToTable(node) {
        this.foods.forEach(function(food) {
            node.append(food.toHTML())
        })
    }
}

module.exports = Meal