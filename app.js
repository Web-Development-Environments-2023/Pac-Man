var context;
var shape = new Object();
var monster_1 = new Object();
var monster_2 = new Object();
var monster_3 = new Object();
var monster_4  = new Object();
var gameMusic = new Audio('/music/backgroundMusic.mp3');
var winnerMusic = new Audio('/music/winnerMusic.mp3');
var gameOverMusic = new Audio('/music/gameoverMusic.mp3');
var monster_list = [monster_1, monster_2, monster_3, monster_4];
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
var num_of_lives;
var pauseCounter;
var pauseAndResumeBtn;
var monsterTimeout;
var monsterMovementMs;
var connectedPlayer;
var inGame;




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
			$('#about_screen').hide();
			$('#gameover_screen').hide();
			$('#gamewinner_screen').hide();
			$('#audio').hide();
			break;

		case "register_screen": // register mode
			$('#register_screen').show();
			$('#start_screen').hide();
			$('#login_screen').hide();
			$('#game_screen').hide();
			$('#settings_screen').hide();
			$('#about_screen').hide();
			$('#gameover_screen').hide();
			$('#gamewinner_screen').hide();
			$('#audio').hide();
			break;

		case "login_screen": // login mode
			$('#login_screen').show();
			$('#start_screen').hide();
			$('#register_screen').hide();
			$('#game_screen').hide();
			$('#settings_screen').hide();
			$('#about_screen').hide();
			$('#gameover_screen').hide();
			$('#gamewinner_screen').hide();
			$('#audio').hide();
			break;

		case "setting_screen": // setting mode
			$('#settings_screen').show();
			$('#login_screen').hide();
			$('#start_screen').hide();
			$('#register_screen').hide();
			$('#game_screen').hide();
			$('#about_screen').hide();
			$('#gameover_screen').hide();
			$('#gamewinner_screen').hide();
			$('#audio').hide();
			break;
		
		case "about_screen": // about mode
			$('#login_screen').hide();
			$('#start_screen').hide();
			$('#register_screen').hide();
			$('#settings_screen').hide();
			$('#game_screen').hide();
			$('#gameover_screen').hide();
			$('#about_screen').show();
			$('#gamewinner_screen').hide();
			$('#audio').hide();
			break;

		case "gameover_screen": // gameover mode
			$('#start_screen').hide();
			$('#register_screen').hide();
			$('#login_screen').hide();
			$('#game_screen').hide();
			$('#settings_screen').hide();
			$('#about_screen').hide();
			$('#gameover_screen').show();
			$('#gamewinner_screen').hide();
			$('#audio').hide();

			break;

		case "gamewinner_screen": // gamewinner mode
			$('#start_screen').hide();
			$('#register_screen').hide();
			$('#login_screen').hide();
			$('#game_screen').hide();
			$('#settings_screen').hide();
			$('#about_screen').hide();
			$('#gameover_screen').hide();
			$('#audio').hide();
			$('#gamewinner_screen').show();
			break;

		case "game_screen": // game mode
			$('#login_screen').hide();
			$('#start_screen').hide();
			$('#register_screen').hide();
			$('#about_screen').hide();
			$('#gameover_screen').hide();
			$('#gamewinner_screen').hide();

			$('#audio').show();
			$('#settings_screen').show();
			$('#game_screen').show();
			updateLogeedUser()
			context = canvas.getContext("2d");
			Start();
			break;
	}
	if(currentScreen != "game_screen")
	{
		clearInterval(interval)
		setTableBorder('0')
		gameMusic.pause();
		gameMusic.currentTime = 0;	
		inGame = false;
	}
}

// game controls not changing?
