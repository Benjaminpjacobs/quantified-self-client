const assert = require('chai').assert
const Food = require("../lib/food.js")

describe('test food object', function() {
    it('should hold name and calories', function() {
        const food = new Food('Banana', 150)
        assert.equal(food.name, 'Banana')
        assert.equal(food.calories, 150)
    })
})