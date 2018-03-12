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

  //Connection Firebase Method
  connectedRef.on("value", function(snap) {
    if (snap.val()) {
        var con = connectionsRef.push(true);
        con.onDisconnect().remove();
    }
});

var playerone = {
    wins: 0,
    losses: 0,
    name: "",
    chat: "",
}

var playertwo = {
    wins: 0,
    losses: 0,
    name: "",
    chat: "",
}

$("#click-button").on("click", function() {
    event.preventDefault();
    playerone.name = $("#name-input").val().trim();
    database.ref().child("object"+playerone.name).set({
        name: playerone.name,
        wins: playerone.wins,
        losses: playerone.losses,
        chat: playerone.chat,
    });
});

$("#chat-send").on("click", function() {
    event.preventDefault();
    playerone.chat = $("#chat-input").val().trim();
    database.ref().child("object"+playerone.name).update({
        chat: playerone.chat,
    });
    var chatadd = $("<p>"+playerone.name+": "+playerone.chat+"</p>")
    $(".chatbox").append(chatadd)
});