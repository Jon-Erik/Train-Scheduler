var config = {
    apiKey: "AIzaSyCaKYEZ4O0p6ryZlTAezZPLcyu9CrCkbaE",
    authDomain: "train-scheduler-234b8.firebaseapp.com",
    databaseURL: "https://train-scheduler-234b8.firebaseio.com",
    projectId: "train-scheduler-234b8",
    storageBucket: "",
    messagingSenderId: "653681032163"
  };

firebase.initializeApp(config);

var database = firebase.database();

$("#submitButton").on("click", function() {
	event.preventDefault();
			
	var name = $("#name-input").val().trim();
	var destination = $("#destination-input").val().trim();
	var firstTrain = moment($("#firsttrain-input").val().trim(), "HH:mm").format("HH:mm");
	var frequency = $("#frequency-input").val().trim();

	$("#name-input").val("");
	$("#destination-input").val("");
	$("#firsttrain-input").val("");
	$("#frequency-input").val("");

	database.ref().push({
		name: name,
		destination: destination,
		"first train": firstTrain,
		frequency: frequency
	})

})

database.ref().orderByChild("start date").on("child_added", function(snapshot) {
	var uniqueID = snapshot.key;

	var newRow = $("<tr class=" + uniqueID + ">");
	$("tbody").append(newRow);
	
	var buttonTD = $("<td scope='row' class='" + uniqueID + " buttonTD'>");
	buttonTD.html("<button id=" + uniqueID + " class='remove btn-sm text-center'>X</button>");
	newRow.append(buttonTD)


	var nameTD = $("<td class=" + uniqueID + ">");
	nameTD.text(snapshot.val().name);
	newRow.append(nameTD);

	var destinationTD = $("<td class=" + uniqueID + ">");
	destinationTD.text(snapshot.val().destination);
	newRow.append(destinationTD);

	var frequencyTD = $("<td class=" + uniqueID + ">");
	frequencyTD.text(snapshot.val().frequency);
	newRow.append(frequencyTD);

		var firstTrainConverted = moment(snapshot.val()["first train"], "HH:mm").subtract(1, "years");

		var diffTime = moment().diff(moment(firstTrainConverted), "minutes");

		var remainder = diffTime % snapshot.val().frequency;

		var minutesTillTrain = snapshot.val().frequency - remainder;

		var nextTrain = moment().add(minutesTillTrain, "minutes");

	var nextArrival = $("<td class=" + uniqueID + ">");
	nextArrival.text(moment(nextTrain).format("hh:mm A"));
	newRow.append(nextArrival);

	var minutesAway = $("<td class=" + uniqueID + ">");
	minutesAway.text(minutesTillTrain);
	newRow.append(minutesAway);
});

var currentTime = moment().format("hh:mm A");
$("#current-time").text(currentTime);

$(document).on("click", ".remove", function() {
	var ID = $(this).attr("id");
	var IDRef = database.ref("/" + ID + "");
	IDRef.remove();
})

database.ref().on("child_removed", function(snapshot) {
	var uniqueID = snapshot.key;
	$("." + uniqueID + "").remove();
});

