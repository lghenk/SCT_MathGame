var socket = io();
$('#myModal').modal({keyboard: false, backdrop: 'static'});

$('#submitButton').click(() => { // User has submitted their name
    let name = $('#yourName').val();

    if(name.length <= 3) {
        $('#noNameError').show();
        console.log("Please enter a name larger than 3 characters");
        return;
    }

    socket.emit('setName', { name: name });
    $('#myModal').modal('hide');
})