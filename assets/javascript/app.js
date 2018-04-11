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
    var currentTime;
    var trainItemCount = 1;


    function updateTime(){
        var nextTrain = moment().format('HH:mm:ss a');
        $('#time').html(nextTrain);
    };
    
    updateTime();

    setInterval(function(){
       updateTime();
    },1000);





    // =========== LOG IN ============== //


    $('.app-body').hide();
    $('.login-body').removeClass('d-none');


    var txtEmail = $('#txtEmail');
    var txtPassword = $('#txtPassword');
    var btnLogin = $('#btnLogin');
    var btnSignUp = $('#btnSignUp');
    var btnLogout = $('#btnLogout');


    // ==================

    btnLogin.on('click', e => {


        var email = txtEmail.val();
        var pass = txtPassword.val();
        var auth = firebase.auth();

        var promise = auth.signInWithEmailAndPassword(email, pass);

        promise.catch(e => console.log(e.message));
    });

    // ==================


    btnSignUp.on('click', e => {


        var email = txtEmail.val();
        var pass = txtPassword.val();


           firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error) {
            console.log(error.code);
            console.log(error.message);
          });

    });

    btnLogout.on('click', function() {
        firebase.auth().signOut();
        $('.app-body').hide();
        $('.login-body').removeClass('d-none');
    })

    // ==================


    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            console.log(firebaseUser);
            console.log('signed in');
            btnLogout.removeClass('d-none');

            $('.app-body').show();
            $('.login-body').addClass('d-none');

        } else {
            console.log('not logged in');
            btnLogout.addClass('d-none');

        }
    });








    // RETRIVE INFORMATION FROM FIREBASE AND DISPLAY TO WINDOW
    database.ref().orderByChild('dateAdded').on('child_added', function(snapshot) {

        var ts = snapshot.val();
        console.log(ts);

        // GENERATE TABLE WITH DATA FROM FIREBASE
        var tableBody = $('tbody');
        var tableRow = $('<tr>');


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


        var showEditButton = $('<td>');
        var editButton = $('<button id="editButton" class="btn">');
        editButton.html('EDIT');
        showEditButton.append(editButton);
        tableRow.append(showEditButton);

        var showRemoveButton = $('<td>');
        var removeButton = $('<button id="removeButton" class="btn">');
        removeButton.html('REMOVE');
        removeButton.attr('train-item', ts.trainItemCount);
        showRemoveButton.append(removeButton);
        tableRow.append(showRemoveButton);


        tableBody.append(tableRow);

        // TRAIN ITEM COUNT MUST BE AFTER ADDING ATTRIBUTE ABOVE
        trainItemCount++;

        $('#google-maps-display').attr('src', "https://www.google.com/maps/embed/v1/place?key=AIzaSyBhSBjmU-q9Jf9qFxhho_cfQjWwo2aJcYs&q=" + ts.destination);







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
            minutesAway: minutesAway,
            trainItemCount: trainItemCount,
            remove: 'false'
        });




    }); // end click event







}); // end document ready function