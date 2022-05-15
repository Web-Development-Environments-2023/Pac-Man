

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
			connectedPlayer = username
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
        if (keynum == 9){
            return;
        }
	var wantedKey
	if(inGame)
	{
		if(keynumExist(keynum))
		{
			return;
		}
	}

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

  function keynumExist(keynum)
  {
	let values = (Object.values(controls));
	if(values.includes(keynum))
		return true
	return false 
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
	$('#numofballs').val(Math.floor((Math.random() * 41) + 50))
	// setting the game time
	$('#gametime').val(Math.floor((Math.random() * 41) + 60))
	// setting the numbers of monsters
	$('#numofmonsters').val(Math.floor((Math.random() * 4) + 1))
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

	update_5_point_food();
	update_15_point_food();
	update_25_point_food();
	showAndHideDivs("game_screen")
  }


function showDialog()
{
	$("#dialog").modal({fadeDuration: 1000});
}

function exitDialog(e)
{
	if(e.keynum == 88)
	{
		rel="modal:close"
	}
}
