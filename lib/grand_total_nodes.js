class GrandTotalNodes {
    constructor(tables) {
        this.goal = tables.find('#goal-calories')
        this.total = tables.find('#total-calories')
        this.remaining = tables.find('#remaining-calories')
        this.tableTotals = tables.find('.total-calories')
    }

}

module.exports = GrandTotalNodes