const socket = io();

//when user clicks the send button

$('#send-btn').click(function (data) {

    const msg = $('#inp-msg').val();
    if(msg == "" || msg == " ") {
        return;
    }
    const userName = $('#name').val();

     
    socket.emit('send_msg', {
        msg: msg,   
        user: userName
    });
    $('#inp-msg').val("");

});






socket.on('recieved_msg', (data) => {
    $('#chat').append(`<li> <strong>${data.user}</strong> : ${data.msg}</li>`)
    $("#chat-box").scrollTop($("#chat-box").outerHeight());
});







$('#login-btn').click(function () {
    const user = $('#login-inp').val();

    // console.log(user);
    
    socket.emit('login', {
        user: user
    })

    $('#login-inp').val("");

})