const $ = require('jquery');
const API = 'https://quantified-self-express-api.herokuapp.com/api/v1'
    // const API = "https://quantified-self-rails-backend.herokuapp.com/api/v1"
    // const API = 'http://localhost:3000/api/v1'

class Food {
    constructor(food) {
        this.id = food.id
        this.name = food.name
        this.calories = food.calories
    }

    toHTML() {
        return `<tr class='food' id=${this.id}>
                  <td class="editable food-name" contenteditable="true">${this.name}</td>
                  <td class="editable food-cal calorie-count" contenteditable="true">${this.calories}</td>
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

    static updateName(id, newName) {
        return $.ajax({
            url: API + `/foods/${id}`,
            type: 'PUT',
            data: { food: { name: newName } },
        })
    }

    static updateCalories(id, newCalories) {
        return $.ajax({
            url: API + `/foods/${id}`,
            type: 'PUT',
            data: { food: { calories: newCalories } },
        })
    }

    static showPopUp(el, id) {
        const popUp = `<div class='confirm-delete'>
                      <p>
                        Changes here will remove the item from the meal table.
                      </p>
                      <button class='btn btn-warning' id='delete-${id}'>Delete</button>
                      <button class='btn btn-primary' id='cancel-deletion'>Cancel</button>
                    </div>`
        return $(el).before(popUp);
    }

    static addNew(food, node) {
        const item = new Food(food)
        node.prepend(item.toHTML())
    }

    static validate(food, foodName, foodCal) {
        let msg = 'Please enter a';
        if (food.name === '') {
            return foodName.append(`<span class="notify">${msg} food name.</span>`);
        } else if (food.calories === '') {
            return foodCal.append(`<span class="notify">${msg} calorie amount.</span>`);
        } else {
            return true;
        }
    }

    static mapObjects(foods) {
        return foods.map(function(food) {
            return new Food(food)
        })
    }

    static appendFoods(foods, nodeA, nodeB) {
        foods.forEach(function(food) {
            nodeA.append(food.toHTML())
            nodeB.append(food.toDiaryHTML())
        })
    }
}

module.exports = Food