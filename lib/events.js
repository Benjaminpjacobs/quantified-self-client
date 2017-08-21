const $ = require('jquery');
const Food = require('./food')
const Meal = require('./meal')
const MealTableVariables = require('./meal_tables')

let target = 2000
let bfastTarget = 400
let lunchTarget = 600
let snackTarget = 200
let dinnerTarget = 800


$(document).ready(function() {
    const $newFoodName = $('#new-food-name')
    const $newFoodCalories = $('#new-food-cal')
    const $foodItemEdit = ('.food .editable')
    const $foodSubmit = $('#submit')
    const $foodIndex = $('#food-index')
    const $foodSearch = $('#food-search')
    const $foodSort = $('#food-sort')
    const $diaryFoodIndex = $('#diary-food-index')
    const $bfastIndex = $('#breakfast-items')
    const $mealButtons = $('.meal-button')
    const $mealTables = $('.meal-tables')
    const $mealItems = $('.meal-items')
    let mealTableVariables = new MealTableVariables({
        breakfast: bfastTarget,
        lunch: lunchTarget,
        snack: snackTarget,
        dinner: dinnerTarget
    })

    const foodIncluded = (node, query) => {
        return $(node)
            .find('td')
            .first()
            .text()
            .toLowerCase()
            .includes(query)
    }

    const sortFoodTable = (direction) => {
        $('#diary-food-index tr').sort(function(a, b) {
            switch (direction) {
                case 'asc':
                    return Number($('td:nth-child(2)', a).text()) - Number($('td:nth-child(2)', b).text());
                    break;
                case 'desc':
                    return Number($('td:nth-child(2)', b).text()) - Number($('td:nth-child(2)', a).text());
                    break;
                case 'orig':
                    return Number(b.id) - Number(a.id)
                    break;
            }
        }).appendTo($('#diary-food-index'))
    }

    const resetIndex = () => {
        $('input:checkbox:checked').prop('checked', false);
        $foodSearch.val('')
        $('#diary-food-index tr').show()
    }

    Food.getAll()
        .then(function(response) {
            return Food.mapObjects(response)
        })
        .then(function(foods) {
            Food.appendFoods(foods, $foodIndex, $diaryFoodIndex)
        })


    Meal.getAll()
        .then(function(response) {
            return response.map(function(meal) {
                return new Meal(meal)
            })
        })
        .then(function(meals) {
            Meal.populateAllTables(meals, mealTableVariables)
        })
        .then(function() {
            Meal.updateGrandTotal(target)
        })

    $foodSubmit.on('click', function() {
        let food = {
            name: $newFoodName.val(),
            calories: $newFoodCalories.val()
        }

        if (Food.validate(food)) {
            Food.addNew(food, $foodIndex);
            $newFoodName.val('');
            $newFoodCalories.val('');
            $('.notify').remove();
        }
    })

    $foodIndex.on('click', '.food .editable.food-name', function() {
      let currentName = this.innerText;
      let id = this.parentElement.id
      $(this).blur(function() {
        if (currentName === this.innerText) {
          return;
        } else {
            let newName = this.innerText
            Food.updateName(id, newName);
            return;
        }
      })
    })

    $foodIndex.on('click', '.food .editable.food-cal', function() {
      let currentCalories = this.innerText;
      let id = this.parentElement.id
      $(this).blur(function() {
        if (currentCalories === this.innerText) {
          return;
        } else {
            let newCalories = this.innerText
            Food.updateCalories(id, newCalories);
            return;
        }
      })
    })

    $foodIndex.on('click', '.delete', function(event) {
        var food = this.parentElement.parentElement
        var id = food.id
        Food.showPopUp(this, id);
        //add event listener for click off popup
        $(this).prev('.confirm-delete').on('click', 'button', function() {
            if (this.id === 'cancel-deletion') {
                $('.confirm-delete').remove();
                return;
            } else {
                Food.delete(id)
                    .then(function() {
                        $(`#${id}`).fadeOut(300);
                    })
            }
        })
    })

    $mealButtons.on('click', function(event) {
        let meal = event.target.id
        let $mealTable = $(`#${meal}-items`)

        $('input:checked').each(function(key, food) {
            let node = food.closest('tr')
            let foodItem = new Food({
                id: node.id,
                name: node.children[0].innerText,
                calories: node.children[1].innerText
            })
            Meal.addFoodItem($mealTable.data().id, foodItem.id)
                .then(function(data) {
                    $mealTable.prepend(foodItem.toHTML())
                    Meal.updateTotal($mealTable)
                })
        })
        resetIndex()
    })

    $mealTables.on('click', '.delete', function(event) {
        let node = this.closest('tr')
        let $mealTable = $(`#${this.closest('tbody').id}`)
        Meal.removeFoodItem($mealTable.data().id, node.id)
            .then(function(data) {
                $(`#${node.id}`).remove();
                Meal.updateTotal($mealTable);
            })
    })

    $foodSearch.on('keyup', function(e) {
        let query = e.target.value.toLowerCase()
        $('#diary-food-index tr')
            .hide()
            .filter(function(index, node) {
                return foodIncluded(node, query)
            })
            .show();
    })

    $foodSort.on('click', function(e) {
        if (e.target.classList.contains('asc')) {
            sortFoodTable('desc')
            $(e.target).attr('class', 'btn btn-primary desc')
            $('.calorie-heading').find('span').attr('class', 'glyphicon glyphicon-arrow-down')
        } else if (e.target.classList.contains('desc')) {
            sortFoodTable('orig')
            $(e.target).attr('class', 'btn btn-primary')
            $('.calorie-heading').find('span').attr('class', '')
        } else {
            sortFoodTable('asc')
            $(e.target).attr('class', 'btn btn-primary asc')
            $('.calorie-heading').find('span').attr('class', 'glyphicon glyphicon-arrow-up')
        }
    })
})
