const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM(`<!DOCTYPE html>`);
const $ = require('jQuery')(window);
const sinon = require('sinon')
const totalTable = require("./stubs/grand_total_stub.js")
const GrandTotalNodes = require('../lib/grand_total_nodes')
const assert = require('chai').assert

describe('test GrandTotalNodes', function() {
    it('should hold all table nodes', function() {
        let test = new GrandTotalNodes(totalTable)
        assert.equal(test.goal.text(), 2000)
        assert.equal(test.remaining.text(), 1000)
        assert.equal(test.total.text(), 1000)
        assert.equal(test.tableTotals.first().text(), 100)
        assert.equal(test.tableTotals.last().text(), 300)
    })
})