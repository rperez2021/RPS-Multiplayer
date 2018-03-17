

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDMLBtF8M_EsYMDNnUTs9jKK75A8-kRrZA",
    authDomain: "rps-multiplayer-ed21c.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-ed21c.firebaseio.com",
    projectId: "rps-multiplayer-ed21c",
    storageBucket: "rps-multiplayer-ed21c.appspot.com",
    messagingSenderId: "866636343825"
};
firebase.initializeApp(config);

var database = firebase.database();
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
var playersRef = database.ref("/playersRef");
var turnRef = database.ref("/turn");
var chatRef = database.ref("/chat");
var userRef;

//Connection Firebase Method
connectedRef.on("value", function (snap) {
    if (snap.val()) {
        var con = connectionsRef.push(true);
        con.onDisconnect().remove();
    }
});

//
function clear_on_disconnect() {
    turnRef.onDisconnect().remove();
    chatRef.onDisconnect().remove();
}


var player = {
    wins: 0,
    losses: 0,
    name: "",
    chat: "",
    selection: "",
}

$("#click-button").on("click", function () {
    event.preventDefault();
    setplayer();
    player.name = $("#name-input").val().trim();
    database.ref("/playersRef").child(player.name).set({
        name: player.name,
        wins: player.wins,
        losses: player.losses,
        chat: player.chat,
        selection: player.selection,
    });
    $("#player1").text(player.name)
    $("#name-input").val("")
    
});

$("#chat-send").on("click", function () {
    event.preventDefault();
    player.chat = $("#chat-input").val().trim();
    database.ref().child(player.name).update({
        chat: player.chat,
    });
    var chatadd = $("<p>" + player.name + ": " + player.chat + "</p>")
    $(".chatbox").append(chatadd)
    $("#chat-input").val("")
});

$("#rpsselection").on("click", ".selections", function () {
    event.preventDefault();
    player.selection = $(this).attr("value");
    database.ref().child(player.name).update({
        selection: player.selection,
    });
    elim_others(player);
});

function elim_others(player) {
    if (player.selection === "rock") {
        $("#p1paper").hide();
        $("#p1scissors").hide();
    } else {
        if (player.selection === "paper") {
            $("#p1rock").hide();
            $("#p1scissors").hide();
        } else {
            $("#p1rock").hide();
            $("#p1paper").hide();
        }
    }
};

function setplayer() {
    // Query database
    database.once('value', function (snapshot) {
        var playerObj = snapshot.child('playersRef');
        var num = playerObj.numChildren();
        // Add player 1
        if (num == 0) {
            // Sets player to 1
            playernum = 1;
            addPlayer(playernum);
            // Check if player 1 disconnected and re-add
        } else if (num == 1 && playerObj.val()[2] !== undefined) {
            // Sets player to 1
            playernum = 1;
            addPlayer(playernum);
            // Start turn by setting turn to 1
            turnRef.set(1);
            // Add player 2
        } else if (num == 1) {
            // Sets player to 2
            playernum = 2;
            addPlayer(playernum);
            // Start turn by setting turn to 1
            turnRef.set(1);
        }
    });
}

function addplayer(count) {
    // Gets player name
    var playerName = $('#name-input').val();
    // Create new child with player number
    userRef = playersRef.child(count);
    // Allows for disconnect
    userRef.onDisconnect().remove();
    // Sets children of player number
    userRef.set({
        'name': playerName,
        'wins': 0,
        'losses': 0
    });
}

// function listeners() {

//     // Listen for a more than two clients
// 			database.on("value", function(snapshot) {
// 				var turnVal = snapshot.child('turn').val();
// 				// if (turnVal !== null && player == undefined) {
// 				// 	var wrapper = $('.wrapper');
// 				// 	var $img = $('<img>').attr('src',"assets/images/header.png");
// 				// 	var $h1 = $('<h1>').text('Please wait until other players finish, then refresh screen.');
// 				// 	wrapper.empty().append($img).append($h1);
// 				// 	throw new Error('Please wait until other players finish, then refresh screen.');
// 				// }
// 			});
// 			// Start button click
// 			// $('#addName').one('click',function() {
// 			// 	game.setPlayer();
// 			// 	return false;
// 			// });
// 			// Show player name in box
// 			playersRef.on('child_added', function(childSnapshot) {
// 				// Gets player number
// 				var key = childSnapshot.key();
// 				// Gets player names
// 				name[key] = childSnapshot.val().name;
// 				// Remove loading and add player name
// 				// var waiting = $('.player' + key + ' > .waiting');
// 				// waiting.empty();
// 				// var $h1 = $('<h1>').text(name[key]);
// 				// waiting.append($h1);				
// 				// Get player wins and losses
// 				var wins = childSnapshot.val().wins;
// 				var losses = childSnapshot.val().losses;
// 				// var $wins = $('<h2>').text('Wins: ' + wins);
// 				// var $losses = $('<h2>').text('Losses: ' + losses);
// 				// $wins.addClass('float-left');
// 				// $losses.addClass('float-right');
// 				// $('.score' + key).append($wins).append($losses);
// 			});
// 			// Remove player name from box on disconnect
// 			playersRef.on('child_removed', function(childSnapshot) {
// 				// Find player that was removed
// 				var key = childSnapshot.key();
// 				// Show 'player has disconnected' on chat
// 				chat.sendDisconnect(key);
// 				// Empty turn message
// 				// $('h4').text('Waiting for another player to join.');
// 				// // Display beginning message
// 				// var waiting = $('.player' + key + ' > .waiting');
// 				// waiting.empty();
// 				// var $h1 = $('<h1>').text('Waiting for player ' + key);
// 				// var $i = $('<i>').addClass('fa fa-spinner fa-spin fa-one-large fa-fw')
// 				// waiting.append($h1).append($i);
// 				// Empty score
// 				// $('.score' + key).text('');
// 				// // Empty divs
// 				// $('.choices1').empty();
// 				// $('.results').empty();
// 				// $('.choices2').empty();
// 			});
// 			// Listen for each turn to direct to proper turn function
// 			turnRef.on('value', function(snapshot) {
// 				var turnNum = snapshot.val();
// 				if (turnNum	== 1) {
// 					// Empty divs
// 					// $('.choices1').empty();
// 					// $('.results').empty();
// 					// $('.choices2').empty();
// 					game.turn1();
// 				} else if (turnNum == 2) {
// 					game.turn2();
// 				} else if (turnNum == 3){
// 					game.turn3();
// 				}
// 			});
// 			// Listen for change in wins and losses for players 1
// 			playersRef.child(1).on('child_changed', function(childSnapshot) {
// 				if (childSnapshot.key() == 'wins') {
// 					wins1 = childSnapshot.val();
// 				} else if (childSnapshot.key() == 'losses') {
// 					losses1 = childSnapshot.val();
// 				}
// 				// Update score display
// 				if (wins1 !== undefined) {
// 					// $('.score1 .float-left').text('Wins: ' + wins1);
// 					// $('.score1 .float-right').text('Losses: ' + losses1);
// 				}
// 			});
// 			// Listen for change in wins and losses for player 2
// 			playersRef.child(2).on('child_changed', function(childSnapshot) {
// 				if (childSnapshot.key() == 'wins') {
// 					wins2 = childSnapshot.val();
// 				} else if (childSnapshot.key() == 'losses') {
// 					losses2 = childSnapshot.val();
// 				}
// 				// Update score display
// 				// $('.score2 .float-left').text('Wins: ' + wins2);
// 				// $('.score2 .float-right').text('Losses: ' + losses2);
// 			});

// }

