
let database = firebase.database();
let userName = '';

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log(user.uid);
        $('#login-status').text('logged in');
    } else {
        $('#login-status').text('not logged in :(');
    }
});

database.ref('sessions').on("child_added", function(snapshot){
    $('#sessions').append('<div>' + snapshot.val().name +'</div>').append('<button id="' + snapshot.val().name + '" class="join-session">Join Session</button>');
});

database.ref('chat').on("child_added", function(snapshot){
    $('#chat-content').append('<p>'+ snapshot.val().displayName +': ' + snapshot.val().chatItem);
});

$(document).ready(function () {
    $(document).on('click', '#login-button', function (event) {
        firebase.auth().signInAnonymously().catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode + ' ' + errorMessage);
        }).then(function (user) {
            user.updateProfile({ displayName: $('#display-name').val() })
        });
    });

    $(document).on('click', '#create-session', function (event) {
        console.log('fired');
        let sessionName = $('#session-name').val();
        database.ref('sessions').push({
            name: sessionName,
            creator: { uid: firebase.auth().currentUser.uid, displayName: firebase.auth().currentUser.displayName },
            state: 'open',
        });
    });

    $(document).on('click','#chat',function(event){
        let item = $('#chat-item').val();
        database.ref('chat').push({
            chatItem: item,
            displayName: firebase.auth().currentUser.displayName,
        });
        $('#chat-item').val('');
    })
});
