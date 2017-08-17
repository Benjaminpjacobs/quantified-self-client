const $ = require('jquery');
const API = "https://quantified-self-rails-backend.herokuapp.com/api/v1"

class Food {
    constructor(food) {
        this.id = food.id
        this.name = food.name
        this.calories = food.calories
    }

    toHTML() {
        return `<tr id=${this.id}>
                  <td>${this.name}</td>
                  <td>${this.calories}</td>
                  <td class='delete-food'>
                    <span class='glyphicon glyphicon-remove-circle'>
                    </span>
                    </td>
                </tr>`
    }

    static getFoods() {
        return $.getJSON(API + '/foods')
    }
    static postFood(food) {
        return $.post(API + `/foods?food[name]=${food.name}&food[calories]=${food.calories}`)
    }
}

module.exports = Food