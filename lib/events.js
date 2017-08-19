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


    Food.getFoods()
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


    Meal.getMeals()
        .then(function(response) {
            return response.map(function(meal) {
                return new Meal(meal)
            })
        })
        .then(function(meals) {
            meals.forEach(function(meal) {
                switch (meal.name) {
                    case "Breakfast":
                        meal.appendToTable($bfastIndex)
                        meal.mealCalories($brfastCal)
                        meal.goalCalories($brfastGoalCal, bfastTarget)
                        meal.mealCaloriesRemaining($brfastRemainingCal, bfastTarget)
                        break;
                    case "Lunch":
                        meal.appendToTable($lunchIndex)
                        meal.mealCalories($lunchCal)
                        meal.goalCalories($lunchGoalCal, lunchTarget)
                        meal.mealCaloriesRemaining($lunchRemainingCal, lunchTarget)
                        break;
                    case "Snack":
                        meal.appendToTable($snackIndex)
                        meal.mealCalories($snackCal)
                        meal.goalCalories($snackGoalCal, snackTarget)
                        meal.mealCaloriesRemaining($snackRemainingCal, snackTarget)
                        break;
                    case "Dinner":
                        meal.appendToTable($dinnerIndex)
                        meal.mealCalories($dinnerCal)
                        meal.goalCalories($dinnerGoalCal, dinnerTarget)
                        meal.mealCaloriesRemaining($dinnerRemainingCal, dinnerTarget)
                        break;
                }
            })
            return meals
        })
        .then(function(meals) {
            let total = meals.reduce(function(sum, meal) {
                return sum + meal.total
            }, 0)
            let remaining = target - total
            $totalCal.text(total)
            $remainingCal.text(remaining)
            $goalCal.text(target)
            if (remaining < 0) {
                $remainingCal.addClass('negative')
            } else {
                $remainingCal.removeClass('negative')
            }
        })

    $foodSubmit.on('click', function() {
        let food = {
            name: $newFoodName.val(),
            calories: $newFoodCalories.val()
        }
        Food.addNewFood(food, $foodIndex)
    })

    $foodIndex.on('click', '.delete', function(event) {
        var food = this.parentElement.parentElement
        var id = food.id
        Food.deleteFood(id)
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
                .fail(function(error) {
                    console.log(error)
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
            .fail(function(error) {
                console.log(error)
            })
    })

    $foodSearch.on('keyup', function(e) {
        let query = e.target.value.toLowerCase()
        $('#diary-food-index tr').filter(function(index, node) {
            return !$(node).find('td').first().text().toLowerCase().includes(query)
        }).hide();
        $('#diary-food-index tr').filter(function(index, node) {
            return $(node).find('td').first().text().toLowerCase().includes(query)
        }).show();
    })

    $foodSort.on('click', function(e) {
        if (e.target.classList.contains('asc')) {
            $('#diary-food-index tr').sort(function(a, b) {
                return $('td:nth-child(2)', b).text().localeCompare($('td:nth-child(2)', a).text());
            }).appendTo($('#diary-food-index'))
            $(e.target).removeClass('asc')
            $(e.target).addClass('desc')
            $('.calorie-heading').find('span').attr('class', 'glyphicon glyphicon-arrow-down')
        } else if (e.target.classList.contains('desc')) {
            $('#diary-food-index tr').sort(function(a, b) {
                return Number(a.id) - Number(b.id)
            }).appendTo($('#diary-food-index'))
            $(e.target).removeClass('desc')
            $('.calorie-heading').find('span').remove();
        } else {
            $('#diary-food-index tr').sort(function(a, b) {
                return $('td:nth-child(2)', a).text().localeCompare($('td:nth-child(2)', b).text());
            }).appendTo($('#diary-food-index'))
            $(e.target).addClass('asc')
            $('.calorie-heading').append(
                "  <span class='glyphicon glyphicon-arrow-up'></span>"
            )
        }
    })
})