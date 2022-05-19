
let heart = new Image();
heart.src = "/resources/images/heart.png"
let special_food_img = new Image();
special_food_img.src = "/resources/images/cherry.png"
let wall_img = new Image();
wall_img.src = "/resources/images/wall.png"


 
// Function that creates the board and randomly puts the food, walls, pacman and monsters
// It then creates an interval that calls at each interval the 'updatePosition' function.
// Below are the code numbers for the board:

// 0 - Passage
// 1 - Food 5 points
// 2 - Food 15 points
// 3 - Food 25 points
// 4 - Wall
// 5 - Monster with passage
// 6 - Monster with food 5 points
// 7 - Monster with food 15 points
// 8 - Monster with food 25 points
// 9 - Pacman
// 10 - Lives (heart)
// 11 - Special Food

function Start() {

	clearInterval(interval)
	board = new Array();
	score = 0;
	pauseCounter = 0;
	pauseAndResumeBtn = document.getElementById('pauseResume');
	pauseAndResumeBtn.textContent = 'Pause';
	pac_color = "yellow";
    num_of_lives = 5;
	var cnt = 100; 
	food_remain = numOfBalls;
	var pacman_remain = 1;
	lifeFlag = false;
	randWall = Math.floor((Math.random() * 4) + 0)
	special_food.eaten = false; // special food that gives 50 points
	inGame = true; // if user is in game mode
	updateMode() // default mode is Easy
	startMusic() // start music

	setTableBorder('1') // set the table border
	start_time = new Date();

	// Builds the board (10X10 matrix)
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		for (var j = 0; j < 10; j++) 
		{
			if (randomizeWalls(i, j, randWall)) 
			{
				board[i][j] = 4; // draws a wall
			} 

			else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt)
				 {
					food_remain--;
					board[i][j] = 1; // draws food
				}
				 else if ((randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) && not_on_monster_places(i, j))
				 {
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 9; // draws pacman
				} else {
					board[i][j] = 0; //draws passage
				}
				cnt--;
			}
		}
	}

	// special food that gives 50 points - puts it in random cell
	let special_food_position = findRandomCell(board, 0)
	special_food.i = special_food_position[0]
	special_food.j = special_food_position[1]
	board[special_food_position[0]][special_food_position[1]] = 11; 

	// puts the remaining food that is left on the board
	while (food_remain > 0) {
		var emptyCell = findRandomCell(board, 0);
		board[emptyCell[0]][emptyCell[1]] = 1;
		food_remain--;
	}

	let food_25 = Math.floor(numOfBalls*0.1);
	let food_15 = Math.floor(numOfBalls*0.3)

	// 10% of all food is transformed into 25 points food
	for (let i = 0; i < food_25; i++){
		let food_cell_to_change = findRandomCell(board, 1)
		board[food_cell_to_change[0]][food_cell_to_change[1]] = 3; //food of 25 points
	}

	// 30% of all food is transformed into 15 points food
	for (let i = 0; i < food_15; i++){
		let food_cell_to_change = findRandomCell(board, 1)
		board[food_cell_to_change[0]][food_cell_to_change[1]] = 2; //food of 15 points
	}

	// put the monsters on the board at the corners
	let monster_positions = [[0,0], [9,9],[0,9],[9,0]]
	for(let num_monst = 0; num_monst < numOfMonsters; num_monst++){
        // check if this position is empty
		if(board[monster_positions[num_monst][0]][monster_positions[num_monst][1]] == 0)// monster on passage cell
		{	
			board[monster_positions[num_monst][0]][monster_positions[num_monst][1]] = 5;
		}
		else if(board[monster_positions[num_monst][0]][monster_positions[num_monst][1]] == 1)// monster on 5 points food cell
		{
			board[monster_positions[num_monst][0]][monster_positions[num_monst][1]] = 6; 
		}
		else if(board[monster_positions[num_monst][0]][monster_positions[num_monst][1]] == 2)// monster on 15 points food cell
		{
			board[monster_positions[num_monst][0]][monster_positions[num_monst][1]] = 7; 
		}
		else if(board[monster_positions[num_monst][0]][monster_positions[num_monst][1]] == 3)// monster on 25 points food cell
		{
			board[monster_positions[num_monst][0]][monster_positions[num_monst][1]] = 8; 
		}

        monster_list[num_monst].i = monster_positions[num_monst][0];
        monster_list[num_monst].j = monster_positions[num_monst][1];
	}

	// Creates event listeners for keydown and keyup events
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
    
	food_remain = numOfBalls;
	// Creates an inteval that calls the updatePosition function at each interval
	monsterTimeout = Date.now();
	interval = setInterval(UpdatePosition, 130);
}

// Function that finds a random cell with the given object code (example: 0 fo passage, 1 for food etc..)
function findRandomCell(board, object_code)
 {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != object_code) 
	{
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
	}
	return [i, j];
}

// Function that returns a personnalized key code of the pressed key
function GetKeyPressed() 
{
    if (keysDown[controls['up']]) {
		return 1;
	}
	if (keysDown[controls['down']]) {
		return 2;
	}
	if (keysDown[controls['right']]) {
		return 4;
	}
	if (keysDown[controls['left']]) {
		return 3;
	}
}

// Function that iterates on each cell of the board matrix and draws the correct item on each cell
function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	lblLive.value = num_of_lives;

	// Iterates on the board
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;

			if (board[i][j] == 9) { //draw pacman 
				let pressed_key = GetKeyPressed()
				
				// Draws pacman in the correct direction
				if (pressed_key == null){
					DrawPacman(last_pac_direction, center)
				}
				else{
					DrawPacman(pressed_key, center)
					last_pac_direction = pressed_key
				}
				
			} else if (board[i][j] == 1) { // draw 5 points food
				context.beginPath();
				context.arc(center.x, center.y, 10, 0, 2 * Math.PI); // circle
				context.fillStyle = food_5_point_color; 
				context.fill();
			} else if (board[i][j] == 2) { // draw 15 points food
				context.beginPath();
				context.arc(center.x, center.y, 10, 0, 2 * Math.PI); 
				context.fillStyle = food_15_point_color; 
				context.fill();
			} else if (board[i][j] == 3) { // draw 25 points food
				context.beginPath();
				context.arc(center.x, center.y, 10, 0, 2 * Math.PI); 
				context.fillStyle = food_25_point_color; 
				context.fill();
			} else if (board[i][j] == 4) { //draw wall
				wall_img.width = "60"
				context.drawImage(wall_img, center.x-30, center.y-30, "60", "60")
			}
			
			// Draws a monster
            else if (board[i][j] == 5 || board[i][j] == 6 || board[i][j] == 7 || board[i][j] == 8)
			{ 
				// Regular monster
				if(regularOrSpaciel(i,j) == "r")
				{
					red_monster.width = "60"
					context.drawImage(red_monster, center.x-30, center.y-30, "50", "50")
				}
				// Special monster (that does 2 time more damage)
				else
				{
					pink_monster.width = "60"
					context.drawImage(pink_monster, center.x-30, center.y-30, "50", "50")
				}
            }

			else if (board[i][j] == 10) //draw heart (bonus live)
			{
				
				heart.width = "60"
				context.drawImage(heart, center.x-30, center.y-30, "50", "50")
			}
			else if (board[i][j] == 11) { //draw special food
				special_food_img.width = "60"
				context.drawImage(special_food_img, center.x-30, center.y-30, "50", "50")
			}
		}
	}
	monsterCounter = 0;
}

// Function that draws the pacman in the given direction
function DrawPacman(direction, center){

	// UP
	if (direction == 1){
		context.beginPath();
		context.arc(center.x, center.y, 25, 1.65 * Math.PI, 1.35 * Math.PI); // half circle
		context.lineTo(center.x, center.y);
		context.fillStyle = pac_color; 
		context.fill();
		context.beginPath();
		context.arc(center.x + 15, center.y + 5, 4, 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; 
		context.fill();
	}

	//DOWN
	else if (direction == 2){
		context.beginPath();
		context.arc(center.x, center.y, 25, 0.65 * Math.PI, 0.35 * Math.PI); // half circle
		context.lineTo(center.x, center.y);
		context.fillStyle = pac_color; 
		context.fill();
		context.beginPath();
		context.arc(center.x + 15, center.y + 3, 4, 0, 2 * Math.PI); // circle
		context.fillStyle = "black";
		context.fill();
	}

	//RIGHT
	else if (direction == 3){
		context.beginPath();
		context.arc(center.x, center.y, 25, 1.15 * Math.PI, 0.85 * Math.PI); // half circle
		context.lineTo(center.x, center.y);
		context.fillStyle = pac_color;
		context.fill();
		context.beginPath();
		context.arc(center.x - 5, center.y - 15, 4, 0, 2 * Math.PI); // circle
		context.fillStyle = "black";
		context.fill();
	}

	//LEFT
	else if (direction == 4){
		context.beginPath();
		context.arc(center.x, center.y, 25, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
		context.lineTo(center.x, center.y);
		context.fillStyle = pac_color;
		context.fill();
		context.beginPath();
		context.arc(center.x + 5, center.y - 15, 4, 0, 2 * Math.PI); // circle
		context.fillStyle = "black";
		context.fill();
	}

	// Default direction - just for the start
	else{
		context.beginPath();
		context.arc(center.x, center.y, 25, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
		context.lineTo(center.x, center.y);
		context.fillStyle = pac_color;
		context.fill();
		context.beginPath();
		context.arc(center.x + 5, center.y - 15, 4, 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; 
		context.fill();
	}
}

// Function that update the position of the pacman, monsters and the special food
function UpdatePosition()
 {
	//First we get the key that has been pressed by the user
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	//Up
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	//Down
	if (x == 2) {
		if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	//Left
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	//Right
	if (x == 4) {
		if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}

	// 5 point food
	if (board[shape.i][shape.j] == 1) {
		food_remain --;
		score = score + 5;
	}
	// 15 point food
	else if (board[shape.i][shape.j] == 2) {
		food_remain--;
		score = score + 15;
	}
	// 25 point food
	else if (board[shape.i][shape.j] == 3) {
		food_remain--;
		score = score + 25;
	}
	// special food
	else if(board[shape.i][shape.j] == 11)
	{
		score = score + 50;
		special_food.eaten = true;
		if(special_food.lastFood != 0)
		{
			food_remain--;
		}
	}
	// extra life
	else if(board[shape.i][shape.j] == 10)
	{
		num_of_lives += 1
	}

	// Monsters
	else if(board[shape.i][shape.j] == 5 || board[shape.i][shape.j] == 6 ||board[shape.i][shape.j] == 7 ||board[shape.i][shape.j] == 8) // step on monster
	{
		if(regularOrSpaciel(shape.i, shape.j) == "r")
		{
			collision(false)

		}
		else
		{
			collision(true)
		}
	}

	board[shape.i][shape.j] = 9;

	// Move the monsters every "monsterMovementMs" seconds
	if(Date.now() - monsterTimeout >= monsterMovementMs)
	{
    	updateMonsterPositions()
		monsterTimeout = Date.now()
		if(!special_food.eaten)
		{
			updateSpecialFoodPosition();
		}
	}

	// Updates the game score and time and checks if the game needs to be finished
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 100 && time_elapsed <= 20) {
		pac_color = "green";
	}
	// If food is finished
	if (food_remain == 0)
	{
		window.clearInterval(interval);
		winnerMusic.play(); // Play winner Music
		showAndHideDivs('gamewinner_screen')
	}
	//Checks if time is over
	if(time_elapsed >= timeForGame)
	{
		gameOver("t")
	}
	else 
	{
		Draw();
	}
}

// Function that updates the position of the special fod
function updateSpecialFoodPosition()
{
	let curr_i = special_food.i
	let curr_j = special_food.j

	// set the current cell value to be what it was before
	board[curr_i][curr_j] = special_food.lastFood;

	let random_step = 0;
	while(random_step != -1)
	{
		random_step = Math.floor((Math.random() * 4) + 0);
		switch(random_step)
		{
			case (0): // down
				if (is_valid_move(curr_i+1, curr_j))
				{
					special_food.i = curr_i + 1
					special_food.lastFood = board[curr_i+1][curr_j]
					board[curr_i + 1][curr_j] = 11
					random_step = -1;
				}
				break;
			case (1): // up
				if (is_valid_move(curr_i-1, curr_j))
				{
					special_food.i = curr_i - 1
					special_food.lastFood = board[curr_i-1][curr_j]
					board[curr_i - 1][curr_j] = 11
					random_step = -1;
				}
				break;
			case (2): // right
				if (is_valid_move(curr_i, curr_j + 1))
				{
					special_food.j = curr_j + 1
					special_food.lastFood = board[curr_i][curr_j + 1]
					board[curr_i][curr_j + 1] = 11
					random_step = -1;
				}
				break;
			case (3): // left
				if (is_valid_move(curr_i, curr_j - 1))
				{
					special_food.j = curr_j - 1
					special_food.lastFood = board[curr_i][curr_j - 1]
					board[curr_i][curr_j - 1] = 11
					random_step = -1;
				}
				break;
		}
	}	
}





// Function that returns a boolean value if a given i and j of a cell is valid (not out of border or wall)
function is_valid_move(i, j)
{
	return ((i >= 0 && i < board.length) && (j >= 0 && j < board[0].length) && ((board[i][j] == 0) || (board[i][j] == 1) || (board[i][j] == 2) || (board[i][j] == 3) || (board[i][j] == 9)))
}





// Function that handles the pause/resume button
function pauseResume()
{
	pauseCounter = pauseCounter + 1;
	if(pauseCounter % 2 == 0)
	{
		//Resume
		interval = setInterval(UpdatePosition, 130);
		pauseAndResumeBtn.textContent = 'Pause';
	}
	else
	{
		//Pause
		clearInterval(interval)
		interval = setInterval(UpdatePosition, 10000000000000000);
		pauseAndResumeBtn.textContent = 'Resume';
	}
}

// Function that changes the game mode between easy/medium/hard. It changes the interval for updating monster positions therefore it changes their speed
function updateMode()
{
	let selectedMode = $('#mode').val();
	switch(selectedMode)
	{
		case "easy":
			monsterMovementMs = 650;
			break;
		case "medium":
			monsterMovementMs = 400;
			break;
		case "hard":
			monsterMovementMs = 150;
			break;
	}
}

// Function that updates the 5 point food color from the user's input
function update_5_point_food()
{
	food_5_point_color = $('#5_point_color').val()
}

// Function that updates the 15 point food color from the user's input
function update_15_point_food()
{
	food_15_point_color = $('#15_point_color').val()
}

// Function that updates the 25 point food color from the user's input
function update_25_point_food()
{
	food_25_point_color = $('#25_point_color').val()
}

// Function that updates the table border
function setTableBorder(num)
{
	let gameTable = $("#settingsAndGame");
	gameTable.attr('border', num);
}

// Function that updates the name of the logged user
function updateLogeedUser()
{
	$('#player_name').html('<h2 style="color: #3399ff;">' + "Player Name: " + connectedPlayer + '</h2>' + '<br>')
}

// Function that starts the music
function startMusic()
{
	gameMusic.loop = true;
	gameMusic.play();
}

// Function that stops the winner music
function stopWinnerMusic()
{
	winnerMusic.pause();
	winnerMusic.currentTime = 0;	
}

// Function that stops the 'game over' music
function stopGameOverMusic()
{
	gameOverMusic.pause();
	gameOverMusic.currentTime = 0;	
}

// Function that returns a boolean value of a check if the given position i,j on the board is a wall
function randomizeWalls(i, j, randWall)
{
	let wallsList = [[[1,3],[1,8], [1,1], [1,2], [3,3], [3,4], [3,5], [6,1], [6,2], [2,5], [7,7], [6,7], [5,7], [6,4], [4,7], [7,6], [7,5], [7,4], [2,7], [8,7]], [[1,8],[8,1],[1,2],[1,1],[5,5], [5,6],[7,5],[3,7],[4,4], [2,5], [3,3], [7,8], [7,2], [6,3]], [[7,7],[7,8],[6,8],[5,8],[4,8],[4,1],[5,1],[6,1],[7,1], [4,4],[7,6],[2,7],[6,6], [2,3], [2,4], [2,1], [2,5], [7,3], [8,3],[7,4]], [[5,6], [6,5],[3,3],[7,7],[6,2],[2,3],[4,4], [2,7], [2,8]]]
	let currWalls = wallsList[randWall]
	for(let k = 0; k < currWalls.length; k++)
	{
		if((i == currWalls[k][0]) && (j == currWalls[k][1]))
		{
			return true;
		}
	}
	return false;
}

// Function that updates the footer style to match different screens
function updateFooterView(bool)
{
	let footer = document.getElementById("footer");
	if(bool)
	{
		footer.style["position"] = "fixed";
	}
	else
	{
		footer.style["position"] = "relative";
	}
}



// Script for disable scrolling on the page using the up/down (inGame) 
var keys = {}; 
window.addEventListener("keydown",
    function(e){
        keys[e.keyCode] = true;
        switch(e.keyCode){
            case 37: case 39: case 38:  case 40: e.preventDefault(); break; // Arrow keys
            // case 32: e.preventDefault(); break; // Space
            default: break; // do not block other keys
        }
    },
false);
window.addEventListener('keyup',
    function(e){
        keys[e.keyCode] = false;
    },
false);




