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
    const $lunchIndex = $('#lunch-items')
    const $snackIndex = $('#snack-items')
    const $dinnerIndex = $('#dinner-items')
    const $brfastCal = $('#breakfast-total-calories')
    const $lunchCal = $('#lunch-total-calories')
    const $snackCal = $('#snack-total-calories')
    const $dinnerCal = $('#dinner-total-calories')
    const $brfastRemainingCal = $('#breakfast-remaining-calories')
    const $lunchRemainingCal = $('#lunch-remaining-calories')
    const $snackRemainingCal = $('#snack-remaining-calories')
    const $dinnerRemainingCal = $('#dinner-remaining-calories')
    const $brfastGoalCal = $('#breakfast-goal-calories')
    const $lunchGoalCal = $('#lunch-goal-calories')
    const $snackGoalCal = $('#snack-goal-calories')
    const $dinnerGoalCal = $('#dinner-goal-calories')
    const $totalCal = $('#total-calories')
    const $remainingCal = $('#remaining-calories')
    const $goalCal = $('#goal-calories')
    const $mealButtons = $('.meal-button')
    const $mealTables = $('.meal-tables')
    const $mealItems = $('.meal-items')

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
                case 'desc':
                    return $('td:nth-child(2)', b).text().localeCompare($('td:nth-child(2)', a).text());
                    break;
                case 'orig':
                    return Number(a.id) - Number(b.id)
                    break;
                case 'asc':
                    return $('td:nth-child(2)', a).text().localeCompare($('td:nth-child(2)', b).text());
                    break;
            }
        }).appendTo($('#diary-food-index'))
    }


    Food.getAll()
        .then(function(response) {
            return response.map(function(food) {
                return new Food(food)
            })
        })
        .then(function(foods) {
            foods.forEach(function(food) {
                $foodIndex.append(food.toHTML())
                $diaryFoodIndex.append(food.toDiaryHTML())
            })
        })


    Meal.getAll()
        .then(function(response) {
            return response.map(function(meal) {
                return new Meal(meal)
            })
        })
        .then(function(meals) {
            meals.forEach(function(meal) {
                switch (meal.name) {
                    case "Breakfast":
                        meal.populateTable($bfastIndex, $brfastCal, $brfastGoalCal, $brfastRemainingCal, bfastTarget)
                        break;
                    case "Lunch":
                        meal.populateTable($lunchIndex, $lunchCal, $lunchGoalCal, $lunchRemainingCal, lunchTarget)
                        break;
                    case "Snack":
                        meal.populateTable($snackIndex, $snackCal, $snackGoalCal, $snackRemainingCal, snackTarget)
                        break;
                    case "Dinner":
                        meal.populateTable($dinnerIndex, $dinnerCal, $dinnerGoalCal, $dinnerRemainingCal, dinnerTarget)
                        break;
                }
            })
            return meals
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

      // if yes, ask user to confirm deletion, message about it being removed from meal table, check meal table calculations
      //if no, just return without doing anything
      //if not on meal table, continue with deletion.

        var food = this.parentElement.parentElement
        var id = food.id
        if ($mealItems.find('.food#' + id)) {
          Food.confirmDelete(event.target, id);
        }

        return false;
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
