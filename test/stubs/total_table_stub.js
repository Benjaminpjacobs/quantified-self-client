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
                <td id='total-calories'></td>
                <td class='remaining-calories' id='remaining-calories'></td>
            </tr>
        </tbody>
    </table>
</div>
</div>`)