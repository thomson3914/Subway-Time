// Initialize Firebase
var config = {
    apiKey: "AIzaSyANR3NGvnxzBKgcEZHkuvwtQrJEjmjDi88",
    authDomain: "traintime-1b085.firebaseapp.com",
    databaseURL: "https://traintime-1b085.firebaseio.com",
    projectId: "traintime-1b085",
    storageBucket: "traintime-1b085.appspot.com",
    messagingSenderId: "99432099980"
};

firebase.initializeApp(config);

// Initial Reference to our Database
var database = firebase.database();

// Button for adding new Subway Line - 03-day 17-timesheetLogic.js
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Get the input values
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var trainTime = $("#train-time-input").val().trim();
    var frequency = $("#frequency-input").val().trim();


    // Get the input values - Creates local "temporary" object for holding new Subway Line
    var newTrain = {
        trainName: trainName,
        destination: destination,
        trainTime: trainTime,
        frequency: frequency
    };

    // Save the new set Subway Line in Firebase
    database.ref().push(newTrain);

    // Log the new Subway Line to console
    console.log(trainName.train);
    console.log(destination.destination);
    console.log(trainTime.trainTime);
    console.log(frequency.frequency);

    // Alert
    alert("Your train has been added! This schedule refreshes every 60 seconds!");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#train-time-input").val("");
    $("#frequency-input").val("");
});

// activity recent-user-with-all-users-solved 07-week 03-day 19-Add_Child
// Firebase watcher + initial loader adding new subway line to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().trainTime;
    var frequency = childSnapshot.val().frequency;

    // Log New subway line values out of childSnapshot
    console.log(trainName);
    console.log(destination);
    console.log(trainTime);
    console.log(frequency);

    // Time Calculations - 07-week 03-day 20-momentjs-solved #3 & 21-train-example
    var trainTimeConverted = moment(trainTime, "hh:mm").subtract(1, "years");
    console.log(trainTimeConverted);

    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    var diffTime = moment().diff(moment(trainTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    var timeApart = diffTime % frequency;
    console.log(timeApart);

    var minutes = frequency - timeApart;
    console.log("MINUTES UNTIL TRAIN: " + minutes);

    var nextArrival = moment().add(minutes, "minutes").format("hh:mm");
    console.log("Arrival Time: " + moment(nextArrival).format("hh:mm"));

    // Append the new row to the table
    $("#train-table > tbody").append(
        "<tr><td>" + trainName +
        "</td><td>" + destination +
        "</td><td>" + frequency +
        "</td><td>" + nextArrival +
        "</td><td>" + minutes +
        "</td></tr>");


    // Button that deletes the Subway Line that is entered in Line Name
    $("#delete").on("click", function (event) {
        trainName = $("#train-name-input").val().trim();
        var ref = firebase.database().ref().orderByKey();
        ref.once("value").then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                // capture train name database values
                var childData = childSnapshot.val().trainName;
                // entered name value matches database value
                if (trainName === childData) {
                    // remove the entire object
                    childSnapshot.ref.remove();
                }
            });
        });
    });


});
