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
        this.total = meal.foods.reduce(function(sum, food) {
            return sum + food.calories
        }, 0)
    }

    static getMeals() {
        return $.getJSON(API + '/meals')
    }

    appendToTable(node) {
        this.foods.forEach(function(food) {
            node.prepend(food.toHTML())
        })
    }

    mealCalories(node) {
        node.text(this.total)
    }

    mealCaloriesRemaining(node, target) {
        let remaining = target - this.total
        node.text(target - this.total)
        if (remaining < 0) {
            node.addClass('negative')
        } else {
            node.removeClass('negative')
        }
    }

}

module.exports = Meal