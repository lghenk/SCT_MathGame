const socket = io();
const scoreField = $('#scoreField');
const timeField = $('#timeField');
const answerField = $('#answerField');
const questionField = $('#questionField');

var score = 0;
var time = 0;
var answer = 0;
var currentQuestion = "";
var curLevel = 1;
var questionsAnswered = 0;
var timeInterval = null;

$('#myModal').modal({keyboard: false, backdrop: 'static'});

$('#submitButton').on('click', () => { // User has submitted their name
    submitName();
});

$('#yourName').keypress(function(e) {
    if(e.which == 13) {
        submitName();
    }
});

answerField.keypress(function(e) {
    if(e.which == 13) {
        submitAnswer();
    }
})

function submitAnswer() {
    answerField.prop("disabled", true);
    questionsAnswered++;
    
    if(answerField.val() == answer) {
        score++;
        answerField.addClass("is-valid");
    } else {
        score--;
        answerField.addClass('is-invalid');
    }

    switch(questionsAnswered) {
        case 10:
            curLevel = 2;
            alert("You entered stage 2");
            break;
        case 20:
            curLevel = 3;
            alert("You entered stage 3");
            break;
        case 30:
            curLevel = 4;
            alert("You entered stage 4");
            break;
    }

    scoreField.html(score);
    
    setTimeout(() => {
        answerField.prop("disabled", false);
        answerField.val("");
        answerField.focus();
        answerField.removeClass('is-invalid');
        answerField.removeClass('is-valid');
        if(questionsAnswered < 40) {
            generateQuestion();
        } else {
            // TODO: Finish test and submit to leader board
            clearInterval(timeInterval);
            socket.emit("finished", {score: score, time: time});
            alert("Finished - Your score has been send to our leaderboard.. If you wanted so or not!");
            window.location.replace("/leaderboard");
            
        }       
    }, 1000);
}

function generateQuestion() {
    if(curLevel == 1) {
        let num1 = Math.floor(Math.random() * 9) + 1;
        let num2 = Math.floor(Math.random() * 9) + 1;
        answer = (num1 * num2);
        questionField.html(num1 + " * " + num2 + " = ?");
    } else if(curLevel == 2) {
        let num1 = Math.floor(Math.random() * 9) + 1;
        let num2 = Math.floor(Math.random() * 9) + 1;
        answer = num2;
        questionField.html(num1 + " * ? = " + answer);
    } else if(curLevel == 3) {
        let num1 = Math.floor(Math.random() * 9) + 1;
        let num2 = Math.floor(Math.random() * 9) + 1;
        let num3 = Math.floor(Math.random() * 9) + 1;
        answer = (num1 * num2 + num3);
        questionField.html(num1 + " * " + num2 + " + " + num3 + " = ?");
    } else if(curLevel == 4) {
        let num1 = Math.floor(Math.random() * 9) + 1;
        let num2 = Math.floor(Math.random() * 9) + 1;
        let num3 = Math.floor(Math.random() * 9) + 1;
    
        let question = Math.floor(Math.random() * 3) + 1;
    
        let endAnswer = (num1 * num2) + num3;

        if(question == 1) {           
            answer = num1;
            questionField.html("? * " + num2 + " + " + num3 + " = " + endAnswer);
        } else if(question == 2) {
            answer = num2;
            questionField.html(num1 + " * ? + " + num3 + " = " + endAnswer);
        } else {
            answer = num3;
            questionField.html(num1 + " * " + num2 + " + ? = " + endAnswer);
        }
    }

    console.log("Answer: " + answer);
}

function submitName() {
    let name = $('#yourName').val();
    
    if(name.length <= 3) {
        $('#noNameError').show();
        console.log("Please enter a name larger than 3 characters");
        return;
    }

    socket.emit('setName', { name: name });
    $('#myModal').modal('hide');
    initialize();
}

function initialize() {
    scoreField.html(score);
    timeField.html(time);
    answerField.focus();
    generateQuestion();

    timeInterval = setInterval(() => {
        time++;
        timeField.html(time);
    }, 1000)
}

$('#yourName').focus();
