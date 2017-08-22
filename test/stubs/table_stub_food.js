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
                        <tr class="food" id="189">
                            <td class="editable food-name" contenteditable="true">Cheesey Poofs</td>
                            <td class="editable food-cal calorie-count" contenteditable="true">456</td>
                            <td class="delete-food">
                              <span class="glyphicon glyphicon-remove-circle delete"></span>
                            </td>
                        </tr>
                        <tr class="food" id="187">
                            <td class="editable food-name" contenteditable="true">Bagel</td>
                            <td class="editable food-cal calorie-count" contenteditable="true">100</td>
                            <td class="delete-food">
                              <span class="glyphicon glyphicon-remove-circle delete"></span>
                            </td>
                        </tr>
                      </tbody>
                    </table>`)
