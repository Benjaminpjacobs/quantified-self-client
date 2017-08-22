const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM(`<!DOCTYPE html>`);
const $ = require('jQuery')(window);

module.exports = $(`<table class="table table-bordered">
                      <thead>
                        <tr>
                            <th>Food</th>
                            <th>Calories</th>
                        </tr>
                      </thead>
                      <tbody class="food-index" id="food-index">
                      </tbody>
                    </table>`)
