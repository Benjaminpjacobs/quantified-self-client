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

    static confirmDelete(target, id) {
        let confirmPopUp = `<div class='confirm-delete'>
                              <p>
                                Changes here will remove the item from the meal table.
                              </p>
                              <button class='btn btn-warning' id='delete-${id}'>Delete</button>
                              <button class='btn btn-primary' id='cancel-deletion'>Cancel</button>
                            </div>`
        return $(target).before(confirmPopUp);
    }

    static addNew(food, node) {
        this.post(food)
            .then(function(response) {
                return new Food(response)
            })
            .then(function(food) {
                node.prepend(food.toHTML())
            })
    }

    static validate(food) {
        let msg = 'Please enter a';
        if (food.name === '') {
            $('.input-food').append(`<span class="notify">${msg} food name.</span>`);
        } else if (food.calories === '') {
            $('.input-calories').append(`<span class="notify">${msg} calorie amount.</span>`);
        } else {
            return true;
        }
    }
}

module.exports = Food
