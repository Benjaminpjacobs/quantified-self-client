const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM(`<!DOCTYPE html>`);
const $ = require('jQuery')(window);

module.exports = $(`<div class='row calculations'>
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
                <td id='total-calories'>1000</td>
                <td class='remaining-calories' id='remaining-calories'>1000</td>
            </tr>
        </tbody>
    </table>
</div>
<div class='total-calories'>100</div>
<div class='total-calories'>300</div>
</div>`)
