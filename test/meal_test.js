const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM(`<!DOCTYPE html>`);
const $ = require('jQuery')(window);
const sinon = require('sinon')
const pry = require('pryjs')

const assert = require('chai').assert
const webdriver = require('selenium-webdriver');
const Meal = require("../lib/meal.js")
const TableNodes = require("../lib/table_nodes.js")
const GrandTotalNodes = require("../lib/grand_total_nodes.js")
const until = webdriver.until;
const frontEndLocation = "http://localhost:8080"

describe('test meal object', function() {
    const meal = new Meal({
        "id": 1,
        "name": "Breakfast",
        "foods": [
            { "id": 4, "name": "Grapes", "calories": 180 },
            { "id": 6, "name": "Yogurt", "calories": 550 },
            { "id": 7, "name": "Macaroni and Cheese", "calories": 950 }
        ]
    })
    const totalTable = $(`<div class='row calculations'>
                            <h1>Totals:</h1>
                            <div class='row'>
                                <table class="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Goal</th>
                                            <th>Total</th>
                                            <th>Remaining</th>
                                        </tr>
                                    </thead>
                                    <tbody id='total-remaining-calories'>
                                        <tr>
                                            <td id='goal-calories'>2000</td>
                                            <td id='total-calories'></td>
                                            <td class='remaining-calories' id='remaining-calories'></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>`)
    const table = $(`<div class='meal-tables' id='meals'>
                      <div class='meal' id='breakfast'>
                          <h1>Breakfast:</h1>
                          <div class=''>
                              <table class="table table-bordered">
                                  <thead>
                                      <tr>
                                          <th>Food</th>
                                          <th>Calorie</th>
                                      </tr>
                                  </thead>
                                  <tbody class='meal-items' id='breakfast-items'>
                                      <tr>
                                          <td><b>Goal Calories:</b></td>
                                          <td class='goal-calories' id='breakfast-goal-calories'></td>
                                      </tr>
                                      <tr>
                                          <td><b>Total Calories:</b></td>
                                          <td class='total-calories' id='breakfast-total-calories'></td>
                                      </tr>
                                      <tr>
                                          <td><b>Remaining Calories:</b></td>
                                          <td class='remaining-calories' id='breakfast-remaining-calories'></td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
                      </div>`)
    const stub = sinon.stub(Meal, 'calculateTotal').returns(400)
    stub.onCall(0).returns(400);
    stub.onCall(1).returns(400);
    stub.returns(1800);

    it('should meal info and food info', function() {
        assert.equal(meal.id, 1)
        assert.equal(meal.name, 'Breakfast')
        assert(Array.isArray(meal.foods));
        assert.equal(meal.foods.length, 3)
        assert.equal(meal.total, 1680)
    })

    it('should populate a table', function() {
        let mealIndex = {
            index: table.find('#breakfast-items'),
            calories: table.find('#breakfast-total-calories'),
            goalCalories: table.find('#breakfast-goal-calories'),
            remainingCal: table.find('#breakfast-remaining-calories'),
            target: 400
        }
        meal.populateTable(mealIndex)
        assert.equal(mealIndex.index.find('.food').length, 3)
        assert.equal(mealIndex.calories.text(), 1680)
        assert.equal(mealIndex.goalCalories.text(), 400)
        assert.equal(mealIndex.remainingCal.text(), -1280)
    })

    it('should update totals', function() {
        let grandTotals = new GrandTotalNodes(totalTable)
        let mealNodes = new TableNodes(table)
        let actual = Meal.updateTotal(mealNodes, grandTotals)
        assert.equal(table.find('.total-calories').text(), 400)
        assert.equal(table.find('.goal-calories').text(), 400)
        assert.equal(table.find('.remaining-calories').text(), 0)
        assert(table.find('.negative').length === 0)
        assert(table.find('.negative'))
        assert.equal(totalTable.find('#goal-calories').text(), 2000)
        assert.equal(totalTable.find('#total-calories').text(), 400)
        assert.equal(totalTable.find('#remaining-calories').text(), 1600)
        sinon.assert.calledTwice(stub)

    })

    it('should update grand total', function() {
        let grandTotals = new GrandTotalNodes(totalTable)
        let actual = Meal.updateGrandTotal(2000, grandTotals)

        sinon.assert.calledThrice(stub)
        assert.equal(totalTable.find('#goal-calories').text(), 2000)
        assert.equal(totalTable.find('#total-calories').text(), 1800)
        assert.equal(totalTable.find('#remaining-calories').text(), 200)
    })
})