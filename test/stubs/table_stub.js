const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM(`<!DOCTYPE html>`);
const $ = require('jQuery')(window);

module.exports = $(`<div class='meal-tables' id='meals'>
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