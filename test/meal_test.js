const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM(`<!DOCTYPE html>`);
const $ = require('jQuery')(window);
const sinon = require('sinon')

const meal = require("./stubs/meal_stub.js")
const table = require("./stubs/table_stub.js")
const totalTable = require("./stubs/total_table_stub.js")

const Meal = require("../lib/meal.js")
const TableNodes = require("../lib/table_nodes.js")
const GrandTotalNodes = require("../lib/grand_total_nodes.js")

const assert = require('chai').assert
const webdriver = require('selenium-webdriver');
const until = webdriver.until;
const frontEndLocation = "http://localhost:8080"

describe('test Meal', function() {
    const mealCalcTotalStub = sinon.stub(Meal, 'calculateTotal').returns(400)
    mealCalcTotalStub.onCall(0).returns(400);
    mealCalcTotalStub.onCall(1).returns(400);
    mealCalcTotalStub.returns(1800);

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

        sinon.assert.calledTwice(mealCalcTotalStub)
    })

    it('should update grand total', function() {
        let grandTotals = new GrandTotalNodes(totalTable)
        let actual = Meal.updateGrandTotal(2000, grandTotals)

        assert.equal(totalTable.find('#goal-calories').text(), 2000)
        assert.equal(totalTable.find('#total-calories').text(), 1800)
        assert.equal(totalTable.find('#remaining-calories').text(), 200)

        sinon.assert.calledThrice(mealCalcTotalStub)
    })
})