const $ = require('jquery');

class MealTableVariables {
    constructor(targets) {
        this.breakfast = {
            index: $('#breakfast-items'),
            calories: $('#breakfast-total-calories'),
            goalCalories: $('#breakfast-goal-calories'),
            remainingCal: $('#breakfast-remaining-calories'),
            target: targets.breakfast
        }

        this.lunch = {
            index: $('#lunch-items'),
            calories: $('#lunch-total-calories'),
            goalCalories: $('#lunch-goal-calories'),
            remainingCal: $('#lunch-remaining-calories'),
            target: targets.lunch
        }

        this.snack = {
            index: $('#snack-items'),
            calories: $('#snack-total-calories'),
            goalCalories: $('#snack-goal-calories'),
            remainingCal: $('#snack-remaining-calories'),
            target: targets.snack
        }
        this.dinner = {
            index: $('#dinner-items'),
            calories: $('#dinner-total-calories'),
            goalCalories: $('#dinner-goal-calories'),
            remainingCal: $('#dinner-remaining-calories'),
            target: targets.dinner
        }
    }
}

module.exports = MealTableVariables