var assert = require('chai').assert;
var webdriver = require('selenium-webdriver');
var until = webdriver.until;
var test = require('selenium-webdriver/testing');
var frontEndLocation = "http://localhost:8080"

const Diary = require("../lib/diary.js")


test.describe('testing my simple blog', function() {
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

    test.it("", function() {

    })
})