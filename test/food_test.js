const assert = require('chai').assert
var webdriver = require('selenium-webdriver');
var until = webdriver.until;
var test = require('selenium-webdriver/testing');
var frontEndLocation = "http://localhost:8080/foods.html"
const Food = require("../lib/food.js")

describe('test food object', function() {
    it('should hold name and calories', function() {
        const food = new Food({ id: 1, name: 'Banana', calories: 150 })
        assert.equal(food.id, 1)
        assert.equal(food.name, 'Banana')
        assert.equal(food.calories, 150)
    })
})
test.describe('testing food index', function() {
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

    test.it("loads all food", function() {
        driver.get(`${frontEndLocation}`);
        driver.wait(until.elementLocated({ css: ".table" }));
        driver.findElements({ css: "#food-index" })
            .then(function(entries) {
                assert.lengthOf(entries, 100);
            });
    })
})