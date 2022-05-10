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




