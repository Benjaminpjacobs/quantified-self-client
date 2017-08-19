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

    static getAll() {
        return $.getJSON(API + '/meals')
    }

    static addFoodItem(mealId, foodId) {
        return $.post(API + `/meals/${mealId}/foods/${foodId}`)
    }

    static removeFoodItem(mealId, foodId) {
        return $.ajax({
            url: API + `/meals/${mealId}/foods/${foodId}`,
            type: 'DELETE',
            headers: {
                'Access-Control-Allow-Headers': 'true',
                'Content-Type': 'application/json',
            }
        });
    }

    static calculateTotal(collection) {
        return collection.map(function(index, node) {
                return Number(node.innerText)
            })
            .toArray()
            .reduce(function(sum, calories) { return sum + calories }, 0)
    }

    static updateTotal(table) {
        let target = Number(table.find('.goal-calories').text())
        let node = table.find('.remaining-calories')
        let newTotal = this.calculateTotal(table.find('.calorie-count'))

        table.find('.total-calories').text(newTotal)
        this.updateRemaining(node, target, newTotal)
        this.updateGrandTotal()
    }


    static updateGrandTotal(totalTarget = undefined) {
        let target = totalTarget || $('#goal-calories').text()
        let remCalNode = $('#remaining-calories')
        let newGrandTotal = this.calculateTotal($('.meal-tables .total-calories'))

        $('#total-calories').text(newGrandTotal)
        $('#goal-calories').text(target)
        this.updateRemaining(remCalNode, target, newGrandTotal)
    }


    static updateRemaining(node, target, newTotal) {
        let remaining = target - newTotal
        node.text(remaining)
        remaining < 0 ?
            node.addClass('negative') :
            node.removeClass('negative')
    }

    static populateAllTables(meals, info) {
        meals.forEach(function(meal) {
            switch (meal.name) {
                case "Breakfast":
                    meal.populateTable(info.breakfast)
                    break;
                case "Lunch":
                    meal.populateTable(info.lunch)
                    break;
                case "Snack":
                    meal.populateTable(info.snack)
                    break;
                case "Dinner":
                    meal.populateTable(info.dinner)
                    break;
            }
        })
    }

    populateTable(data) {
        this.appendToTable(data.index);
        this.mealCalories(data.calories);
        this.goalCalories(data.goalCalories, data.target);
        this.mealCaloriesRemaining(data.remainingCal, data.target);
    }

    appendToTable(node) {
        node.data().id = this.id
        this.foods.forEach(function(food) {
            node.prepend(food.toHTML())
        })
    }

    mealCalories(node) {
        node.text(this.total)
    }

    goalCalories(node, target) {
        node.text(target)
    }

    mealCaloriesRemaining(node, target) {
        Meal.updateRemaining(node, target, this.total);
    }


}

module.exports = Meal