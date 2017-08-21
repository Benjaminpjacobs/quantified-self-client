var Promise = require('bluebird');
const sinon = require('sinon')
const pry = require('pryjs');
const assert = require('chai').assert
const Food = require("../lib/food.js")
var webdriver = require('selenium-webdriver');
var until = webdriver.until;
var test = require('selenium-webdriver/testing');
var frontEndLocation = "http://localhost:8080/foods.html"

describe('test food object', function() {

    it('should hold name and calories', function() {
        const food = new Food({ id: 1, name: 'Banana', calories: 150 })
        assert.equal(food.id, 1)
        assert.equal(food.name, 'Banana')
        assert.equal(food.calories, 150)
    })

    it('should return HTML', function() {
        const food = new Food({ id: 1, name: 'Banana', calories: 150 })
        let expected = `<tr class='food' id=1>
                  <td class="editable food-name" contenteditable="true">Banana</td>
                  <td class="editable food-cal" contenteditable="true" class='calorie-count'>150</td>
                  <td class='delete-food'>
                    <span class='glyphicon glyphicon-remove-circle delete'>
                    </span>
                    </td>
                </tr>`
        assert.equal(food.toHTML(), expected)
    })

    it('should return different HTML for the Diary', function() {
        const food = new Food({ id: 1, name: 'Banana', calories: 150 })
        let expected = `<tr class='food' id=1>
                <td>Banana</td>
                <td>150</td>
                <td class='add-food-check'>
                  <input type='checkbox'>
                  </td>
              </tr>`
        assert.equal(food.toDiaryHTML(), expected)
    })

    it('should validate food', function() {
        let nodeStub = { append: function(input) { return input } }
        let food = new Food({ id: 1, name: 'Banana', calories: 150 })

        assert.isTrue(Food.validate(food))

        let food2 = new Food({ id: 1, name: '', calories: 150 })
        assert.equal(Food.validate(food2, nodeStub, nodeStub), '<span class="notify">Please enter a food name.</span>')

        let food3 = new Food({ id: 1, name: 'Banana', calories: '' })
        assert.equal(Food.validate(food3, nodeStub, nodeStub), '<span class="notify">Please enter a calorie amount.</span>')
    })

    it('should map food objects', function() {
        let foods = [{ id: 1, name: 'Banana', calories: 150 }, { id: 2, name: 'Apple', calories: 50 }, { id: 3, name: 'orange', calories: 120 }]
        let foodObjects = Food.mapObjects(foods)
        assert.instanceOf(foodObjects[0], Food)
        assert.instanceOf(foodObjects[1], Food)
        assert.instanceOf(foodObjects[2], Food)
    })

    it('should add new food', function() {
        function NodeStub() {
            this.result = ''
            this.prepend = function(input) { this.result = input }
        }
        let nodeStub = new NodeStub
        let stub = sinon.stub(Food, 'post').returns(new Promise((resolve, reject) => { resolve({ id: 1, name: 'Banana', calories: 150 }) }))
        let food = new Food({ id: 1, name: 'Banana', calories: 150 })
        let call = Food.addNew(food, nodeStub)
        sinon.assert.calledOnce(stub)
            // assert.equal(nodeStub.result, expected)

    })
})

test.describe('testing my foods', function() {
    var driver;
    this.timeout(10000);

    test.beforeEach(function() {
        driver = new webdriver.Builder()
            .forBrowser('chrome')
            .build();
    });

    test.afterEach(function() {
        driver.quit();
    });

    test.it("lists all the foods on load", function() {
        driver.get(`${frontEndLocation}`);
        driver.wait(until.elementLocated({ id: "1" }));
        driver.findElements({ css: ".food" })
            .then(function(entries) {
                assert.isAbove(entries.length, 5);
            });
    });

    test.it("adds food", function() {
        let originalFoodList = ''
        driver.get(`${frontEndLocation}`);
        driver.wait(until.elementLocated({ id: "1" }));
        driver.findElements({ css: ".food" })
            .then(function(foods) {
                originalFoodList = foods.length
            });
        driver.findElement({ id: 'new-food-name' }).sendKeys("Bagel");
        driver.findElement({ id: 'new-food-cal' }).sendKeys("100");
        driver.findElement({ id: 'submit' }).click();
        driver.sleep(1000)
        driver.findElements({ css: ".food" })
            .then(function(foods) {
                let diff = foods.length - originalFoodList
                assert.equal(diff, 1)
            });
    });

    test.it("deletes food", function() {
        let originalFoodList = ''
        driver.get(`${frontEndLocation}`);
        driver.wait(until.elementLocated({ id: "1" }));
        driver.findElements({ css: ".food" })
            .then(function(foods) {
                originalFoodList = foods.length
            });
        driver.findElement({ css: '.delete' }).click();
        driver.sleep(1000)
        driver.findElements({ css: ".food" })
            .then(function(foods) {
                let diff = originalFoodList - foods.length
                assert.equal(diff, 1)
            });
    });


});