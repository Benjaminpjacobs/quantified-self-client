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
                        <tr class="food" id="5">
                            <td class="editable food-name" contenteditable="true">Blueberry Muffins</td>
                            <td class="editable food-cal calorie-count" contenteditable="true">450</td>
                            <td class="delete-food">
                              <span class="glyphicon glyphicon-remove-circle delete"></span>
                            </td>
                        </tr>
                        <tr class="food" id="2">
                            <td class="editable food-name" contenteditable="true">Bagel Bites - Four Cheese</td>
                            <td class="editable food-cal calorie-count" contenteditable="true">650</td>
                            <td class="delete-food">
                              <span class="glyphicon glyphicon-remove-circle delete"></span>
                            </td>
                        </tr>
                      </tbody>
                    </table>`)
