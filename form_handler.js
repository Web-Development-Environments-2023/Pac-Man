
// Function that checks the login form
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

$.validator.addMethod("fullnameCheck", function(value) {
  return /(^[a-zA-Z]{4,}(?: [a-zA-Z]+){0,2}$)\b/.test(value);
}, 'full name check');



$.validator.addMethod("passCheck", function(value){
	return checkPwd(value)}, 'password check');


// Validate function
$().ready(function(){
	
	$("#register_form").validate({
		rules: {
			username:{required: true},
			password:{required: true, minlength: 6, passCheck: true},
			fullname:{required: true, fullnameCheck: true},
			email:{required: true, email: true},
			birthdate:{date: true}
		},
		messages: {
		    username: "<br/>Error validation message",
		    password: {
			required: "<br/>Please provide a password",
			minlength: "<br/>Your password must be at least 6 characters long",
			passCheck: "<br/>Your password must contain numbers and letters"},  
		    fullname: "<br/>Please enter a valid full name",
			email: "<br/>Please enter a valid email address"
		},
	})
});


function submit()
{
	let username = $('#username').val()
	let password = $('#password').val()
	let fullname = $('#fullname').val()
	let email = $('#email').val()
	let birthdate = $('#birthdate').val()

	//	Checks that all the fields are not empty
	if ((username == '') || (password == '') || (fullname == '') || (email == '') || (birthdate == '')){
		// window.alert('Missing values - please fill all the values to register')
		return
	}

	// Check that the username is not exist in the system
	if(username in users)
	{
		window.alert('Your username \'' + username + '\' already exists in the system' )
		return
	}

	users[username] = password
	window.alert('You have been Registered Successfully' )
	$('#username').val("")
	$('#password').val("")
	$('#fullname').val("")
	$('#email').val("")
	$('#birthdate').val("")
	showAndHideDivs("login_screen")
}



// Function that checks if a given password is more than 6 char and has digits and letters
function checkPwd(str) {
	if (str.length < 6) {
		return false;
	} else if (str.search(/\d/) == -1) {
		return false;
	} else if (str.search(/[a-zA-Z]/) == -1) {
		return false;
	}
	return true; 
}

// Function that checks if a given fullname has no digits in it
function checkFullname(str) {
	if (str.search(/\d/) != -1) {
		return false;
	}
	return true;
}


  
  // Function for updating the game controls (up,down,left,right)
  function myKeyPress(e, key) 
  {
	var keynum;
	// Waits for the event
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

  // Function that checks if a pressed keynum has been configured in the game and needs an action to be performed
  function keynumExist(keynum)
  {
	let values = (Object.values(controls));
	if(values.includes(keynum))
		return true
	return false 
  }

  // Function that sets default values for the movement of the pacman (up, down, left, right arrows)
  function defaultKeySettings()
  {
	  
	controls = {'up':38, 'down':40, 'right':39, 'left':37}
	$('#moveup').val("up")
	$('#movedown').val("down")
	$('#moveright').val("right")
	$('#moveleft').val("left")
  }

  // Function that sets random settings for the game
  function randomGameSettings(){
	// setting the numbers of balls
	$('#numofballs').val(Math.floor((Math.random() * 41) + 50))
	// setting the game time
	$('#gametime').val(Math.floor((Math.random() * 41) + 60))
	// setting the numbers of monsters
	$('#numofmonsters').val(Math.floor((Math.random() * 4) + 1))
  }

  // Function that checks that the settings for the game are correct
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

	// Checks the constraint of the number of balls
	if (numOfBalls < 50 || numOfBalls > 90){
		window.alert('Number of balls should be between 50-90.')
		return
	}

	// Checks the constraint of the game time
	if (timeForGame < 60){
		window.alert('Game time should be more than 60 sec.')
		return
	}

	// Checks the constraint on the number of monsters
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
