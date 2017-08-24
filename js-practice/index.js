$(document).ready(function() {
    var $mealItems = $('.meal-item')
    $('.meal-title').on('click', function() {
        var count = 0
        var numItems = $mealItems.length
        var currentRot = 0
        var rotation = 360 / numItems
        $mealItems.each(function(index, element) {
            $(element).show(function() {
                $(element).css(`transform`, `rotate(${currentRot}deg) translate(8em) rotate(-${currentRot}deg)`);
                currentRot = currentRot + rotation
            });
        });
    });

    let rotationState = 'paused'
    $('.rotate-border').hover(function() {
      let rotationState = 'running';
      $(this).css(`-webkit-animation`, `rotation 60s infinite linear 0s ${rotationState}`);
    }, function() {
        $(this).css(`-webkit-animation`, `rotation 60s infinite linear 0s paused`);
    })
});
