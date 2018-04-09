$(document).ready(function() {

    // INITIALIZE FIREBASE
    var config = {
        apiKey: "AIzaSyB7_FbS33j3ok15eWLA5uu3YQJQ2FmqIAg",
        authDomain: "train-scheduler-8f14d.firebaseapp.com",
        databaseURL: "https://train-scheduler-8f14d.firebaseio.com",
        projectId: "train-scheduler-8f14d",
        storageBucket: "",
        messagingSenderId: "451935226364"
      };

    firebase.initializeApp(config);

    // ASSIGN GLOBAL VARIABLES
    var database = firebase.database();

    var trainName = '';
    var destination = '';
    var trainTime = '';
    var frequency = '';
    var nextArrival = '';
    var minutesAway = '';


    // RETRIVE INFORMATION FROM FIREBASE AND DISPLAY TO WINDOW
    database.ref().orderByChild('dateAdded').limitToLast(1).on('child_added', function(snapshot) {

        var ts = snapshot.val();
        console.log(ts);

        // GENERATE TABLE WITH DATA FROM FIREBASE
        var tableBody = $('tbody');
        var tableRow = $('<tr>');


        // var nameColumn = $('<th id="name-column">');

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


        // CONVERT NEGATIVE VALUES OF MINUTES TO POSITIVE
        if (ts.minutesAway < 0) {
            ts.minutesAway = (ts.minutesAway * -1) + 1440;
            var showMinutesAway = $('<td>');
            showMinutesAway.html(ts.minutesAway);
            tableRow.append(showMinutesAway);
        } else {
            var showMinutesAway = $('<td>');
            showMinutesAway.html(minutesAway);
            tableRow.append(showMinutesAway);
        }


        tableBody.append(tableRow);

    }); // end display from firebase


    // WHEN USER CLICKS 'SUBMIT'
    $('#submit').click(function() {

        event.preventDefault();

        // STORE INPUT VALUES INTO VARIABLES
        trainName = $('#train-name').val();
        destination = $('#destination').val();
        trainTime = $('#train-time').val();
        frequency = $('#frequency').val();


        // CONVERT TIME FROM THE FIRST TRAIN RIDE UNTIL THE NEXT ARRIVAL
        var firstTrain = moment(trainTime, "HH:mm").format('LT');
        console.log('First train ride: ' + firstTrain); 
    
        nextArrival = moment(trainTime, "HH:mm").add(frequency, 'm').format('LT');
        console.log('Next arrival: ' + nextArrival);

        // CALCULATE TIME FROM NOW UNTIL THE NEXT TRAIN RIDE
        // CONVERT TIMES TO MINUTES
        var currentTime = moment().format('LT');
        console.log('Current Time: ' + currentTime);
    
        minutesAway = moment(nextArrival, 'LT').diff(moment(currentTime, 'LT'), 'm');
        console.log('Minutes Away: ' + minutesAway);


        // STORE ALL VALUES INTO FIREBASE
        database.ref().push({
            trainName: trainName,
            destination: destination,
            trainTime: trainTime,
            frequency: frequency,
            nextArrival: nextArrival,
            minutesAway: minutesAway
        });


    }); // end click event


}); // end document ready function