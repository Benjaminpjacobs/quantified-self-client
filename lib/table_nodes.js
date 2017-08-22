class TableNodes {
    constructor(table) {
        this.goal = table.find('.goal-calories')
        this.remaining = table.find('.remaining-calories')
        this.foods = table.find('.calorie-count')
        this.total = table.find('.total-calories')
    }

    targetNumber() {
        return Number(this.goal.text())
    }

}

module.exports = TableNodes