const $ = require('jquery');

const Food = require('./food')
const Meal = require('./meal')
const TableNodes = require('./table_nodes')
const GrandTotalNodes = require('./grand_total_nodes')

const grandTotals = new GrandTotalNodes($('#meals'))
const $foodSearch = $('#food-search')
const $mealTables = $('.meal-tables')
const $inputFood = $('.input-food')
const $inputCalories = $('.input-calories')
const $newFoodName = $('#new-food-name')
const $newFoodCalories = $('#new-food-cal')
const $foodItemEdit = ('.food .editable')
const $foodSubmit = $('#submit')
const $foodIndex = $('#food-index')
const $diaryFoodIndex = $('#diary-food-index')
const $bfastIndex = $('#breakfast-items')
const $mealButtons = $('.meal-button')
const $mealItems = $('.meal-items')

const foodIncluded = (node, query) => {
    return $(node)
        .find('td')
        .first()
        .text()
        .toLowerCase()
        .includes(query)
}

const addNewFood = (food, node) => {
    Food.post(food)
        .then(function(response) {
            Food.addNew(response, node)
        })
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

const deleteFoodFromMeal = (e) => {
    let node = e.currentTarget.closest('tr')
    let $mealTable = $(`#${e.currentTarget.closest('tbody').id}`)
    Meal.removeFoodItem($mealTable.data().id, node.id)
        .then(removeFoodFromMeal($(`#${node.id}`), $mealTable))
}

const deleteFoodFromIndex = (e, node) => {
    var food = e.currentTarget.parentElement.parentElement
    var id = food.id
    Food.showPopUp(e.currentTarget, id);
    //add event listener for click off popup
    $(e.currentTarget).prev(node).on('click', 'button', function() {
        if (e.currentTarget.id === 'cancel-deletion') {
            $(node).remove();
            return;
        } else {
            Food.delete(id)
                .then(function() {
                    $(`#${id}`).fadeOut(300);
                })
        }
    })

}

const updateFoodCal = (e) => {
    let currentCalories = e.currentTarget.innerText;
    let id = e.currentTarget.parentElement.id
    $(e.currentTarget).blur(function() {
        if (currentCalories === e.currentTarget.innerText) {
            return;
        } else {
            let newCalories = e.currentTarget.innerText
            Food.updateCalories(id, newCalories);
            return;
        }
    })
}

const updateFoodName = (e) => {
    let currentName = e.currentTarget.innerText;
    let id = e.currentTarget.parentElement.id
    $(e.currentTarget).blur(function() {
        if (currentName === e.currentTarget.innerText) {
            return;
        } else {
            let newName = e.currentTarget.innerText
            Food.updateName(id, newName);
            return;
        }
    })
}

const submitFood = () => {
    let food = {
        name: $newFoodName.val(),
        calories: $newFoodCalories.val()
    }
    if (Food.validate(food, $inputFood, $inputCalories) === true) {
        addNewFood(food, $foodIndex);
        clearFields([$newFoodName, $newFoodCalories]);
        $('.notify').remove();
    }
}


const addFoodToMealsTable = (e, checkedFoods) => {
    let $mealTable = $(`#${event.target.id}-items`)
    addEachFoodToMeal($mealTable, checkedFoods);
    resetIndex()
}


// const addFoodToMealsTable = (checkedFoods) => {
//     return (event) => {

//         let $mealTable = $(`#${event.target.id}-items`)
//         addEachFoodToMeal($mealTable, checkedFoods);
//         resetIndex()
//     }
// }

module.exports = {
    deleteFoodFromIndex,
    deleteFoodFromMeal,
    addFoodToMealsTable,
    filterFoods,
    sorterFunction,
    submitFood,
    updateFoodCal,
    updateFoodName
}