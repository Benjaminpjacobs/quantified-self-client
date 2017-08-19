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
                  <td>Banana</td>
                  <td class='calorie-count'>150</td>
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
        let food = new Food({ id: 1, name: 'Banana', calories: 150 })
        assert.isTrue(Food.validate(food))
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

    // test.it("deletes food", function() {
    //     let originalFoodList = ''
    //     driver.get(`${frontEndLocation}`);
    //     driver.wait(until.elementLocated({ id: "1" }));
    //     driver.findElements({ css: ".food" })
    //         .then(function(foods) {
    //             originalFoodList = foods.length
    //         });
    //     driver.findElement({ css: '.delete' }).click();
    //     driver.sleep(1000)
    //     driver.findElements({ css: ".food" })
    //         .then(function(foods) {
    //             let diff = originalFoodList - foods.length
    //             assert.equal(diff, 1)
    //         });
    // });


});