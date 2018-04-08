$(document).ready(function() {

    var nextArrival;
    var minutesAway;
    var trainFrequency;

    $('#submit').click(function() {

        event.preventDefault();

        var trainName = $('#train-name').val();
        var destination = $('#destination').val();
        var trainTime = $('#train-time').val();
        var frequency = $('#frequency').val();

        var tableBody = $('tbody');
        var tableRow = $('<tr>');


        // var nameColumn = $('<th id="name-column">');

        var showTrainName = $('<td>');
        showTrainName.html(trainName);
        // nameColumn.append(showTrainName);
        tableRow.append(showTrainName);

        var showDestination = $('<td>');
        showDestination.html(destination);
        tableRow.append(showDestination);

        var showFrequency = $('<td>');
        showFrequency.html(frequency);
        tableRow.append(showFrequency);


        var firstTrain = moment(trainTime, "HH:mm").format('LT');
        console.log('First train ride: ' + firstTrain); 

        nextArrival = moment(trainTime, "HH:mm").add(frequency, 'm').format('LT');
        console.log('Next arrival: ' + nextArrival);

        var showNextArrival = $('<td>');
        showNextArrival.html(nextArrival)
        tableRow.append(showNextArrival);



        var currentTime = moment().format('LT');
        console.log('Current Time: ' + currentTime);

        var minutesDifference = moment(nextArrival, 'LT').diff(moment(currentTime, 'LT'), 'm');
        console.log('Minutes Away: ' + minutesDifference);

        if (minutesDifference < 0) {
            minutesDifference *= -1;
            var showMinutesAway = $('<td>');
            showMinutesAway.html(minutesDifference);
            tableRow.append(showMinutesAway);
        } else {
            var showMinutesAway = $('<td>');
            showMinutesAway.html(minutesDifference);
            tableRow.append(showMinutesAway);
        }

        tableBody.append(tableRow);

    });











})