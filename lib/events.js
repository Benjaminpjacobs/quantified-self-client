const $ = require('jquery');
const Food = require('./food')
const Meal = require('./meal')
const MealTableVariables = require('./meal_table_variables')
const TableNodes = require('./table_nodes')
const GrandTotalNodes = require('./grand_total_nodes')

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
    const mealTableVariables = new MealTableVariables({
        breakfast: bfastTarget,
        lunch: lunchTarget,
        snack: snackTarget,
        dinner: dinnerTarget
    })

    const grandTotals = new GrandTotalNodes($('#meals'))

    ///////////////////////   
    // Event Functions
    //////////////////////

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
        $('.add-food-check input:checkbox:checked').prop('checked', false);
        $foodSearch.val('')
        $('#diary-food-index tr').show()
    }

    const prependToTable = (node, food) => {
        node.prepend(food.toHTML())
    }

    const updateMealTableTotal = (mealTable, foodItem) => {
        Meal.addFoodItem(mealTable.data().id, foodItem.id)
            .then(function(data) {
                prependToTable(mealTable, foodItem)
                let mealNodes = new TableNodes(mealTable)

                Meal.updateTotal(mealNodes, grandTotals)
            })

    }

    const addEachFoodToMeal = (mealTable, checkedFoods) => {
        checkedFoods.each(function(key, food) {
            let node = food.closest('tr')
            let foodItem = new Food({
                id: node.id,
                name: node.children[0].innerText,
                calories: node.children[1].innerText
            })
            updateMealTableTotal(mealTable, foodItem);
        })
    }

    const removeFoodFromMeal = (node, mealTable) => {
        node.remove();
        let mealNodes = new TableNodes(mealTable)
        Meal.updateTotal(mealNodes, grandTotals)

    }

    const clearFields = (nodeCollection) => {
        nodeCollection.forEach(function(node) {
            node.val('');
        })
    }


    const sorterFunction = (e, node) => {
        if (e.target.classList.contains('asc')) {
            sortFoodTable('desc')
            $(e.target).attr('class', 'btn btn-primary desc')
            node.find('span').attr('class', 'glyphicon glyphicon-arrow-down')
        } else if (e.target.classList.contains('desc')) {
            sortFoodTable('orig')
            $(e.target).attr('class', 'btn btn-primary')
            node.find('span').attr('class', '')
        } else {
            sortFoodTable('asc')
            $(e.target).attr('class', 'btn btn-primary asc')
            node.find('span').attr('class', 'glyphicon glyphicon-arrow-up')
        }
    }


    const filterFoods = (e, node) => {
        let query = e.target.value.toLowerCase()
        node
            .hide()
            .filter(function(index, node) {
                return foodIncluded(node, query)
            })
            .show();
    }

    ///////////////////////   
    // Initial Functions
    //////////////////////

    if ($('#food-index') !== 0) {
        Food.getAll()
            .then(function(response) {
                return Food.mapObjects(response)
            })
            .then(function(foods) {
                Food.appendFoods(foods, $foodIndex, $diaryFoodIndex)
            })
    }

    if ($('#diary-food-index').length !== 0) {
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
                Meal.updateGrandTotal(target, grandTotals)
            })
    }

    ///////////////////////   
    // Event Listeners
    //////////////////////


    $foodSubmit.on('click', function() {
        let food = {
            name: $newFoodName.val(),
            calories: $newFoodCalories.val()
        }
        if (Food.validate(food, $('.input-food'), $('.input-calories')) === true) {
            Food.addNew(food, $foodIndex);
            clearFields([$newFoodName, $newFoodCalories]);
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
        let $mealTable = $(`#${event.target.id}-items`)
        addEachFoodToMeal($mealTable, $('.add-food-check input:checked'));
        resetIndex()
    })

    const deleteFoodFromMeal = (e) => {
        let node = e.currentTarget.closest('tr')
        let $mealTable = $(`#${e.currentTarget.closest('tbody').id}`)
        Meal.removeFoodItem($mealTable.data().id, node.id)
            .then(removeFoodFromMeal($(`#${node.id}`), $mealTable))
    }

    $mealTables.on('click', '.delete', (e) => { deleteFoodFromMeal(e) })

    $foodSearch.on('keyup', (e) => { filterFoods(e, $('.food-index tr')) })

    $foodSort.on('click', (e) => { sorterFunction(e, $('.calorie-heading')) })
})