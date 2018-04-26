$(document).ready(function() {

    // ASSIGN GLOBAL VARIABLES
    var database = firebase.database();

    var trainName = '';
    var destination = '';
    var trainTime = '';
    var frequency = '';
    var nextArrival = '';
    var minutesAway = '';
    var currentTime;
    var trainItemCount = 1;


    // RETRIVE INFORMATION FROM FIREBASE AND DISPLAY TO WINDOW
    database.ref().on('child_added', function(snapshot) {

        var ts = snapshot.val();
        console.log(ts);

        // GENERATE TABLE WITH DATA FROM FIREBASE
        var tableBody = $('tbody');
        var tableRow = $('<tr>');

        // GIVE EACH ROW AN ATTRIBUTE TO IDENTIFY VALUE FOR REMOVE BUTTON
        tableRow.attr('train-item', ts.trainItemCount);


        var showTrainName = $('<td>');
        showTrainName.html(ts.trainName);
        // nameColumn.append(showTrainName);
        tableRow.append(showTrainName);

        var showDestination = $('<td>');
        showDestination.html(ts.destination);
        tableRow.append(showDestination);

        var showFrequency = $('<td>');
        showFrequency.html(ts.frequency);
        tableRow.append(showFrequency);

        var showNextArrival = $('<td>');
        showNextArrival.html(ts.nextArrival)
        tableRow.append(showNextArrival);


        // CONVERT NEGATIVE VALUES OF MINUTES TO POSITIVE BY ADDING THE DIFFERENCE TO TOTAL MINUTES IN A DAY
        if (ts.minutesAway < 0) {
            ts.minutesAway = (ts.minutesAway * 1) + 1440;
            var showMinutesAway = $('<td>');
            showMinutesAway.html(ts.minutesAway);
            tableRow.append(showMinutesAway);
        } else {
            var showMinutesAway = $('<td>');
            showMinutesAway.html(ts.minutesAway);
            tableRow.append(showMinutesAway);
        }



        var showEditButton = $('<td>');
        var editButton = $('<button id="editButton" class="btn">');
        editButton.html('UPDATE');
        showEditButton.append(editButton);
        tableRow.append(showEditButton);

        var showRemoveButton = $('<td>');
        var removeButton = $('<button id="removeButton" class="btn">');
        removeButton.html('REMOVE');
        removeButton.attr('train-item', ts.trainItemCount);
        showRemoveButton.append(removeButton);
        tableRow.append(showRemoveButton);

        tableBody.append(tableRow);



        // TRAIN ITEM COUNT MUST INCREMENT AFTER ADDING ATTRIBUTES ABOVE
        trainItemCount++;

        // DISPLAY LOCATION ON GOOGLE MAPS
        $('#google-maps-display').attr('src', "https://www.google.com/maps/embed/v1/place?key=AIzaSyBhSBjmU-q9Jf9qFxhho_cfQjWwo2aJcYs&q=" + ts.destination);

        
    }); // end display from firebase
    

    // ================ WHEN USER CLICKS 'SUBMIT' ================//
    $('#submit').click(function(event) {

        event.preventDefault();


        // STORE INPUT VALUES INTO VARIABLES
        trainName = $('#train-name').val();
        destination = $('#destination').val();
        trainTime = $('#train-time').val();
        frequency = $('#frequency').val();


        // CONVERT TIME FROM THE FIRST TRAIN RIDE UNTIL THE NEXT ARRIVAL
        var firstTrain = moment(trainTime, "HH:mm A").format('LT');
        console.log('First train ride: ' + firstTrain); 
    
        nextArrival = moment(trainTime, "HH:mm A").add(frequency, 'm').format('LT');
        console.log('Next arrival: ' + nextArrival);


        // CALCULATE TIME FROM NOW UNTIL THE NEXT TRAIN RIDE
        // CONVERT TIMES TO MINUTES
        var currentTime = moment().format('LT');
        console.log('Current Time: ' + currentTime);
    
        minutesAway = moment(nextArrival, 'LT').diff(moment(currentTime, 'LT'), 'm');
        console.log('Minutes Away: ' + minutesAway);


        database.ref().push({
            trainName: trainName,
            destination: destination,
            trainTime: trainTime,
            frequency: frequency,
            nextArrival: nextArrival,
            minutesAway: minutesAway,
            trainItemCount: trainItemCount,
        });
        

    }); // end click event


//     $("body").on("click", "#removeButton", function(){
//         $(this).closest('tr').remove();

//         trainKey = $(this).parent().parent().attr('train-item');
//         console.log(trainKey);
//         database.ref().child('/users/' + userId).remove();
//    });


}); // end document ready function