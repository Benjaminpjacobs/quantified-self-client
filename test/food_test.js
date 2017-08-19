const assert = require('chai').assert
const Food = require("../lib/food.js")

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
})