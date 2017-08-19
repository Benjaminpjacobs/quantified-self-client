const $ = require('jquery');
const API = "https://quantified-self-rails-backend.herokuapp.com/api/v1"
    // const API = "http://localhost:3001/api/v1"

class Food {
    constructor(food) {
        this.id = food.id
        this.name = food.name
        this.calories = food.calories
    }

    toHTML() {
        return `<tr class='food' id=${this.id}>
                  <td>${this.name}</td>
                  <td class='calorie-count'>${this.calories}</td>
                  <td class='delete-food'>
                    <span class='glyphicon glyphicon-remove-circle delete'>
                    </span>
                    </td>
                </tr>`
    }
    toDiaryHTML() {
        return `<tr class='food' id=${this.id}>
                <td>${this.name}</td>
                <td>${this.calories}</td>
                <td class='add-food-check'>
                  <input type='checkbox'>
                  </td>
              </tr>`
    }

    static getAll() {
        return $.getJSON(API + '/foods')
    }
    static post(food) {
        return $.post(API + `/foods?food[name]=${food.name}&food[calories]=${food.calories}`)
    }

    static delete(id) {
        return $.ajax({
            url: API + `/foods/${id}`,
            type: 'DELETE',
            headers: {
                'Access-Control-Allow-Headers': 'true',
                'Content-Type': 'application/json',
            }
        });
    }
}

module.exports = Food