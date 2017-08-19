const $ = require('jquery');
const Food = require('./food')
const Meal = require('./meal')

let target = 2000
let bfastTarget = 400
let lunchTarget = 600
let snackTarget = 200
let dinnerTarget = 800


$(document).ready(function() {
    const $newFoodName = $('#new-food-name')
    const $newFoodCalories = $('#new-food-cal')
    const $foodSubmit = $('#submit')
    const $foodIndex = $('#food-index')
    const $foodSearch = $('#food-search')
    const $foodSort = $('#food-sort')
    const $diaryFoodIndex = $('#diary-food-index')
    const $bfastIndex = $('#breakfast-items')
    const $mealButtons = $('.meal-button')
    const $mealTables = $('.meal-tables')
    const mealTableVariables = {
        breakfast: {
            index: $('#breakfast-items'),
            calories: $('#breakfast-total-calories'),
            goalCalories: $('#breakfast-goal-calories'),
            remainingCal: $('#breakfast-remaining-calories'),
            target: bfastTarget
        },
        lunch: {
            index: $('#lunch-items'),
            calories: $('#lunch-total-calories'),
            goalCalories: $('#lunch-goal-calories'),
            remainingCal: $('#lunch-remaining-calories'),
            target: lunchTarget
        },
        snack: {
            index: $('#snack-items'),
            calories: $('#snack-total-calories'),
            goalCalories: $('#snack-goal-calories'),
            remainingCal: $('#snack-remaining-calories'),
            target: snackTarget
        },
        dinner: {
            index: $('#dinner-items'),
            calories: $('#dinner-total-calories'),
            goalCalories: $('#dinner-goal-calories'),
            remainingCal: $('#dinner-remaining-calories'),
            target: dinnerTarget
        }
    }

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

    $foodIndex.on('click', '.delete', function(event) {
        var food = this.parentElement.parentElement
        var id = food.id
        Food.delete(id)
            .then(function() {
                $(`#${id}`).fadeOut(300);
            })
    })

    $mealButtons.on('click', function(event) {
        let meal = event.target.id
        let $mealTable = $(`#${meal}-items`)

        $('input:checked').each(function(key, food) {
            let node = food.closest('tr')
            let foodItem = {
                id: node.id,
                name: node.children[0].innerText,
                calories: node.children[1].innerText
            }
            Meal.addFoodItem($mealTable.data().id, foodItem.id)
                .then(function(data) {
                    let foodObj = new Food(foodItem)
                    $mealTable.prepend(foodObj.toHTML())
                    Meal.updateTotal($mealTable)
                })
        })
        $('input:checkbox:checked').prop('checked', false);
        $foodSearch.val('')
        $('#diary-food-index tr').show()
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