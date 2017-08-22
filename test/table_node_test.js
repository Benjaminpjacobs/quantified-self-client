const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM(`<!DOCTYPE html>`);
const $ = require('jQuery')(window);
const sinon = require('sinon')
const table = require("./stubs/table_node_stub.js")
const TableNodes = require('../lib/table_nodes')
const assert = require('chai').assert
const pry = require('pryjs')

describe('test TableNode', function() {
    it('holds all table node data', function() {
        let test = new TableNodes(table)
        assert.equal(test.goal.text(), 400)
        assert.equal(test.remaining.text(), 250)
        assert.equal(test.total.text(), 150)
        assert.equal(test.foods.first().text(), 100)
        assert.equal(test.foods.last().text(), 50)
    })
})