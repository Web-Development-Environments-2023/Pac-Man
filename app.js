var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var users = {};
var controls = {}
var numOfMonsters;
var numOfBalls;
var timeForGame;
var last_pac_direction;




$(document).ready(function()
 {
	showAndHideDivs("start_screen")
	// showAndHideDivs("game_screen")
	users["k"] = "k"
});

function Register()
{
	showAndHideDivs("register_screen")
}

function Login()
{
	showAndHideDivs("login_screen")
}

function showAndHideDivs(currentScreen)
{
	switch(currentScreen)
	{
		case "start_screen": // start mode
			$('#start_screen').show();
			$('#register_screen').hide();
			$('#login_screen').hide();
			$('#game_screen').hide();
			$('#settings_screen').hide();
			break;

		case "register_screen": // register mode
			$('#register_screen').show();
			$('#start_screen').hide();
			$('#login_screen').hide();
			$('#game_screen').hide();
			$('#settings_screen').hide();
			break;

		case "login_screen": // login mode
			$('#login_screen').show();
			$('#start_screen').hide();
			$('#register_screen').hide();
			$('#game_screen').hide();
			$('#settings_screen').hide();
			break;

		case "setting_screen": // setting mode
			$('#settings_screen').show();
			$('#login_screen').hide();
			$('#start_screen').hide();
			$('#register_screen').hide();
			$('#game_screen').hide();
			break;

		case "game_screen": // game mode
			$('#login_screen').hide();
			$('#start_screen').hide();
			$('#register_screen').hide();
			$('#settings_screen').show();

			
			$('#game_screen').show();
			context = canvas.getContext("2d");
			Start();
			break;
	}
}

function check_login_form()
{
	let username = $('#usernameL').val()
	let password = $('#passwordL').val()

	// Check if the username is exist
	if(username in users)
	{
		// Check if the password is correct
		if(users[username] == password)
		{	
			window.alert('login successfully')
			showAndHideDivs("setting_screen")
		}
		else
		{	
			$('#passwordL').val('')
			window.alert('You have entered a wrong password')
		}
	}
	else
	{
		$('#usernameL').val('')
		$('#passwordL').val('')
		window.alert('The username \'' + username + '\' is not registed')
	}

}

function check_register_form(){
	let username = $('#username').val()
	let password = $('#password').val()
	let fullname = $('#fullname').val()
	let email = $('#email').val()
	let birthdate = $('#birthdate').val()
	
	// Checks that all the fields are not empty
	if ((username == '') || (password == '') || (fullname == '') || (email == '') || (birthdate == '')){
		window.alert('Missing values - please fill all the values to register')
		return
	}

	// Checks that the inputs don't have spaces (except full name and birthdate)
	if ((username == '' || (/\s/).test(username)) || (password == '' || (/\s/).test(password)) || (email == '' || (/\s/).test(email))){
		window.alert('Illegal character (whitespace) in username or password or email.')
		return
	}

	// Checks that the password contains at least 6 digits of numbers and letters
	let valid_pwd = checkPwd(password)
	if (valid_pwd != true){
		window.alert('Your password ' + valid_pwd)
		return
	}
	
	// Checks that the fullname contains no numbers in it
	let valid_fullname = checkFullname(fullname)
	if (valid_fullname != true){
		window.alert('Your fullname ' + valid_fullname)
		return
	}

	// Checks that the email is valid
	let valid_email = checkEmail(email)
	if (valid_email != true)
	{
		window.alert('Your email is not a valid email address')
		return
	
	}

	// Check that the username is not exist in the system
	if(username in users)
	{
		window.alert('Your username \'' + username + '\' is already exist in the system' )
		return
	}

	users[username] = password
	window.alert('You have been Registered Successfully' )
	showAndHideDivs("login_screen")
}

// function check_form(){
// 	let username = $('#usernameL').val()
// 	let password = ('#passwordL').val()
// 	window.alert('Your email is not a valid email address')
// }

// Function that checks if a given password is more than 6 char and has digits and letters
function checkPwd(str) {
	if (str.length < 6) {
		return("is too short - you need at least 6 characters");
	} else if (str.search(/\d/) == -1) {
		return("has no numbers in it - you need at least 1 digit");
	} else if (str.search(/[a-zA-Z]/) == -1) {
		return("has no letters in it - you need at least 1 letter");
	}
	return true;
}

// Function that checks if a given fullname has no digits in it
function checkFullname(str) {
	if (str.search(/\d/) != -1) {
		return("has numbers in it - a name can't have numbers");
	}
	return true;
}

// Function that checks if a given email is valid
function checkEmail(email) {
	// if (str.search(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/) != -1) {
	// 	return("is not a valid email address");
	// }
	// return true;
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
  }
  
  function myKeyPress(e, key) // Function for updating the game controls (up,down,left,right)
  {
	var keynum;
	if(window.event)                
		keynum = e.keyCode;
	var wantedKey

	switch(key)
	{
		case('up'):
			wantedKey = $('#moveup')
			controls['up'] = keynum
			break;
		case('down'):
			wantedKey = $('#movedown')
			controls['down'] = keynum
			break;
		case('right'):
			wantedKey = $('#moveright')
			controls['right'] = keynum
			break;
		case('left'):
			wantedKey = $('#moveleft')
			controls['left'] = keynum
			break;
	}

	if (e.keyCode == '38') {
		wantedKey.val('up')
	}
	else if (e.keyCode == '40') {
		wantedKey.val('down')
	}
	else if (e.keyCode == '39') {
		wantedKey.val('right')
	}
	else if (e.keyCode == '37') {
		wantedKey.val('left')
	}
	else
		wantedKey.val('')
  }

  function defaultKeySettings()
  {
	  // setting the default moving controls
	controls = {'up':38, 'down':40, 'right':39, 'left':37}
	$('#moveup').val("up")
	$('#movedown').val("down")
	$('#moveright').val("right")
	$('#moveleft').val("left")
  }

  function randomGameSettings(){
	// setting the numbers of balls
	// var randomNumOfBalls = Math.floor((Math.random() * 40) + 50);
	$('#numofballs').val(Math.floor((Math.random() * 40) + 50))

	// setting the game time
	// var randomNumOfBalls = Math.floor((Math.random() * 40) + 60);
	$('#gametime').val(Math.floor((Math.random() * 40) + 60))

	// setting the numbers of monsters
	// var randomNumOfBalls = Math.floor((Math.random() * 3) + 1);
	$('#numofmonsters').val(Math.floor((Math.random() * 3) + 1))
  }

  function check_settings_form(){
	// Extracts all the inputs from the form and saves them to variables
	let up = $('#moveup').val()
	let down = $('#movedown').val()
	let right = $('#moveright').val()
	let left = $('#moveleft').val()
	numOfMonsters = $('#numofmonsters').val();
	numOfBalls = $('#numofballs').val();
	timeForGame = $('#gametime').val();
	
	// Checks that all the fields are not empty
	if ((up == '') || (down == '') || (right == '') || (left == '') || (numOfMonsters == '') || (numOfBalls == '') || (timeForGame == '')){
		window.alert('Missing values - please fill all the values to proceed')
		return
	}

	// Checks that there aren't 2 identical keys
	let set_of_keys = new Set([up, down, right, left]);
	if (set_of_keys.size != 4){
		window.alert('Identical keys error - You configured 2 or more different movements with the same keys, please configure for each movement a different key')
		return
	}

	if (numOfBalls < 50 || numOfBalls > 90){
		window.alert('Number of balls should be between 50-90.')
		return
	}

	if (timeForGame < 60){
		window.alert('Game time should be more than 60 sec.')
		return
	}

	if (numOfMonsters < 1 || numOfMonsters > 4){
		window.alert('Number of monsters should be between 1-4.')
		return
	}

	showAndHideDivs("game_screen")
	
  }


function Start() {
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 100;
	var food_remain = 50;
	var pacman_remain = 1;
	start_time = new Date();
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 10; j++) {
			if (
				(i == 3 && j == 3) ||
				(i == 3 && j == 4) ||
				(i == 3 && j == 5) ||
				(i == 6 && j == 1) ||
				(i == 6 && j == 2)
			) {
				board[i][j] = 4; // draws a wall
			} else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {
					food_remain--;
					board[i][j] = 1; // draws food
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2; // draws pacman
				} else {
					board[i][j] = 0; //draws passage
				}
				cnt--;
			}
		}
	}
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		food_remain--;
	}


	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	interval = setInterval(UpdatePosition, 150);
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[38]) {
		return 1;
	}
	if (keysDown[40]) {
		return 2;
	}
	if (keysDown[37]) {
		return 3;
	}
	if (keysDown[39]) {
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) {
				let pressed_key = GetKeyPressed()
				if (pressed_key == null){
					DrawPacman(last_pac_direction, center)
				}
				else{
					DrawPacman(pressed_key, center)
					last_pac_direction = pressed_key
				}
				
			} else if (board[i][j] == 1) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
		}
	}
}

function DrawPacman(direction, center){

	// UP
	if (direction == 1){
		context.beginPath();
		context.arc(center.x, center.y, 30, 1.65 * Math.PI, 1.35 * Math.PI); // half circle
		context.lineTo(center.x, center.y);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(center.x + 15, center.y + 5, 5, 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; //color
		context.fill();
	}

	//DOWN
	else if (direction == 2){
		context.beginPath();
		context.arc(center.x, center.y, 30, 0.65 * Math.PI, 0.35 * Math.PI); // half circle
		context.lineTo(center.x, center.y);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(center.x + 15, center.y + 3, 5, 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; //color
		context.fill();
	}

	//RIGHT
	else if (direction == 3){
		context.beginPath();
		context.arc(center.x, center.y, 30, 1.15 * Math.PI, 0.85 * Math.PI); // half circle
		context.lineTo(center.x, center.y);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(center.x - 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; //color
		context.fill();
	}

	//LEFT
	else if (direction == 4){
		context.beginPath();
		context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
		context.lineTo(center.x, center.y);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; //color
		context.fill();
	}

	// Default direction - just for the start
	else{
		context.beginPath();
		context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
		context.lineTo(center.x, center.y);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; //color
		context.fill();
	}
	
}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (x == 2) {
		if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (x == 4) {
		if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}
	if (board[shape.i][shape.j] == 1) {
		score++;
	}
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
	if (score == 50) {
		window.clearInterval(interval);
		window.alert("Game completed");
	} else {
		Draw();
	}
}
