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
                <tr><td class='calorie-count'>100</td></tr>
                <tr><td class='calorie-count'>50</td></tr>
                <tr>
                    <td><b>Goal Calories:</b></td>
                    <td class='goal-calories' id='breakfast-goal-calories'>400</td>
                </tr>
                <tr>
                    <td><b>Total Calories:</b></td>
                    <td class='total-calories' id='breakfast-total-calories'>150</td>
                </tr>
                <tr>
                    <td><b>Remaining Calories:</b></td>
                    <td class='remaining-calories' id='breakfast-remaining-calories'>250</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>`)