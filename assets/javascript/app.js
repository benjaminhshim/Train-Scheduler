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


    // =========== LOG IN ============== //


    // HIDE THE APP AND SHOW LOG-IN WINDOW
    $('.app-body').hide();
    $('.login-body').removeClass('d-none');

    // STORE HTML ELEMENTS INTO VARIABLES
    var txtEmail = $('#txtEmail');
    var txtPassword = $('#txtPassword');
    var btnLogin = $('#btnLogin');
    var btnSignUp = $('#btnSignUp');
    var btnLogout = $('#btnLogout');


    // SIGN IN WHEN CLICKING 'LOG IN'
    btnLogin.on('click', e => {

        // STORE USER INPUT VALUES
        var email = txtEmail.val();
        var pass = txtPassword.val();
        var auth = firebase.auth();

        var promise = auth.signInWithEmailAndPassword(email, pass);

        promise.catch(e => console.log(e.message));

    });


    // REGISTER A NEW ACCOUNT WHEN CLICKING 'SIGN UP'
    btnSignUp.on('click', e => {

        var email = txtEmail.val();
        var pass = txtPassword.val();

        firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error) {
        console.log(error.code);
        console.log(error.message);

        });

    });

    // LOG OUT
    btnLogout.on('click', function() {

        firebase.auth().signOut().then(function() {

            location.replace('index.html');
    
            $('#time').empty();
            $('#time').html('LOG IN TO SEE SCHEDULE');

            txtEmail.val('');
            txtPassword.val('');
        })

    })






    // ================== WHEN DATA CHANGES IN FIREBASE ===================== //
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            console.log(firebaseUser);
            console.log('logged in as ' + firebase.auth().currentUser.email);
            btnLogout.removeClass('d-none');

            user = firebase.auth().currentUser;
            userId = firebase.auth().currentUser.uid;

            getUserData(userId);
            

            // SHOW APP
            $('.app-body').show();
            // HIDE LOG-IN WINDOW
            $('.login-body').addClass('d-none');
            // EMPTY SEARCH FIELD VALUES
            $('#train-name').val('');
            $('#destination').val('');
            $('#train-time').val('');
            $('#frequency').val('');

            // SHOW CURRENT TIME UPDATING IN REAL-TIME IN SECONDS
            function updateTime(){
                var nextTrain = moment().format('HH:mm:ss A');
                $('#time').html(nextTrain);
            };

            setInterval(updateTime, 1000);

            $('#time').css(
                {
                    'font-size': '12px',
                    'letter-spacing': '5px',
                    'padding': '15px'
                }
            );


        } else {
            console.log('logged out');
            btnLogout.addClass('d-none');

            $('#time').html('LOG IN TO SEE SCHEDULE');
            $('#time').css(
                {
                    'font-size': '12px',
                    'letter-spacing': '5px',
                    'padding': '15px'
                }
            ); // end css


        }; // end else statement

    });

    
    function getUserData(userId) {
        // RETRIVE INFORMATION FROM FIREBASE AND DISPLAY TO WINDOW
        database.ref().child('/users/' + userId).on('child_added', function(snapshot) {

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
    }

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


        // STORE ALL VALUES INTO FIREBASE
        userId = firebase.auth().currentUser.uid;
        console.log('user: ' + userId);

        database.ref('/users/' + userId).push({
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


//     $("body").on("click", "#removeButton", function(){
//         $(this).closest('tr').remove();

//         trainKey = $(this).parent().parent().attr('train-item');
//         console.log(trainKey);
//         database.ref().child('/users/' + userId).remove();
//    });


}); // end document ready function