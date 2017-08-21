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

    static updateTotal(mealNodes, grandTotals) {
        let target = Number(mealNodes.goal.text())
        let node = mealNodes.remaining
        let newTotal = this.calculateTotal(mealNodes.foodTotals)

        mealNodes.total.text(newTotal)
        this.updateRemaining(node, target, newTotal)
        this.updateGrandTotal(null, grandTotals)
    }

    static updateGrandTotal(totalTarget = undefined, grandTotals) {
        let target = totalTarget || grandTotals.goal.text()
        let newGrandTotal = this.calculateTotal(grandTotals.tableTotals)

        this.insertValueToNode(grandTotals.total, newGrandTotal)
        this.insertValueToNode(grandTotals.goal, target)
        this.updateRemaining(grandTotals.remaining, target, newGrandTotal)
    }


    static updateRemaining(node, target, newTotal) {
        let remaining = target - newTotal
        node.text(remaining)
        remaining < 0 ?
            node.addClass('negative') :
            node.removeClass('negative')
    }

    static populateAllTables(meals, mealVars) {
        meals.forEach(function(meal) {
            switch (meal.name) {
                case "Breakfast":
                    meal.populateTable(mealVars.breakfast)
                    break;
                case "Lunch":
                    meal.populateTable(mealVars.lunch)
                    break;
                case "Snack":
                    meal.populateTable(mealVars.snack)
                    break;
                case "Dinner":
                    meal.populateTable(mealVars.dinner)
                    break;
            }
        })
    }

    static insertValueToNode(node, targetValue) {
        node.text(targetValue)
    }

    populateTable(meal) {
        this.appendToTable(meal.index);
        this.mealCalories(meal.calories);
        this.insertValueToNode(meal.goalCalories, meal.target);
        this.mealCaloriesRemaining(meal.remainingCal, meal.target);
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

    insertValueToNode(node, targetValue) {
        Meal.insertValueToNode(node, targetValue)
    }

    mealCaloriesRemaining(node, target) {
        Meal.updateRemaining(node, target, this.total);
    }
}

module.exports = Meal