let red_monster = new Image();
red_monster.src = "https://png2.cleanpng.com/sh/950efaa866f9473cac4b2f4cf9846796/L0KzQYm3VMA3N6V8iZH0aYP2gLBuTgBia15yedC2Z3jyg8X6TgBia15yedC2NXHmSIHphcdmOGc4Tqk3MEK5QYm5VcAyPWM4SKcENki6SYKCUb5xdpg=/kisspng-pac-man-ghosts-pac-man-5ac80be7e06367.0261825015230596879191.png"
let pink_monster = new Image();
pink_monster.src = "https://png2.cleanpng.com/sh/9a8e3a15ea191ee6827115384f4e66d1/L0KzQYm3U8E4N6FmiZH0aYP2gLBuTgBia15yedC2YXT5dbB7lgJme15uhp99aX3oPcHog71uaZ9ueZ95YXOwfbL1TfdidZYyiNt3az3qeLF6lL1kdJp1eeR9cz24cbLqgshmOWE5T6Q6ND63QYG9V8A4OmI6SqM7Nki8RoK3UcgzNqFzf3==/kisspng-pac-man-adventures-in-time-pac-mania-pac-man-game-pink-ghost-cliparts-5aacb8e1047214.4106707215212689610182.png"
let heart = new Image();
heart.src = "https://www.501commons.org/donate/Heart.jpg/image_preview"
let special_food_img = new Image();
special_food_img.src = "https://png2.cleanpng.com/sh/bbfd0b4af505fdaca3828a11b463a601/L0KzQYm3U8IxN5l6iZH0aYP2gLBuTgBia15yedC2Y3jogsPCTgBwe6UygeY2bnB3dX77TgNpcaN5ReV9aXPudcO0kPFkdZJzRdVxZYL1iX73jvcuPZJnSaY8OEDmQ4LsVscvQWg9UaM9N0O0RYO4VcY3PWo3T6sEMj7zfri=/kisspng-pac-man-cherry-post-it-note-t-shirt-sticker-pacman-cherry-png-5ab14380c31e67.9789147315215665927992.png"



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
	var food_remain = numOfBalls;
	var pacman_remain = 1;
	lifeFlag = false;
	randWall = Math.floor((Math.random() * 4) + 0)
	inGame = true; // inGame
	updateMode() // defualt mode is Easy
	startMusic() // start music
	setTableBorder('1') // set the table border
	start_time = new Date();
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		for (var j = 0; j < 10; j++) 
		{
            if ((i == 0 && j == 0) || (i == 0 && j == 9) || (i == 9 && j == 0) || (i == 9 && j == 9))//Reserved places for the monsters
				{
                    continue
                }

			if (randomizeWalls(i, j, randWall)) 
			{
				board[i][j] = 4; // draws a wall
			} 

			else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {
					food_remain--;
					board[i][j] = 1; // draws food
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
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

	// special food that gives 50 points
	let special_food_position = findRandomCell(board, 0)
	special_food.i = special_food_position[0]
	special_food.j = special_food_position[1]
	board[special_food_position[0]][special_food_position[1]] = 11; 

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



	// put the monsters on the board
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
    // UpdatePosition();
	monsterTimeout = Date.now();
	interval = setInterval(UpdatePosition, 130);

}

// Function that finds a random cell with the given object code (example: 0 fo passage, 1 for food, 2 for pacman etc..)
function findRandomCell(board, object_code) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != object_code) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
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

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	lblLive.value = num_of_lives;
	let monsterCounter = 0;
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 9) { //draw pacman
				let pressed_key = GetKeyPressed()
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
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; 
				context.fill();
			}
						
			
            else if (board[i][j] == 5 || board[i][j] == 6 || board[i][j] == 7 || board[i][j] == 8){ // draw monsters
				monsterCounter += 1;
				if(monsterCounter != 3)
				{
					red_monster.width = "60"
					context.drawImage(red_monster, center.x-30, center.y-30, "50", "50")
				}
				else
				{
					pink_monster.width = "60"
					context.drawImage(pink_monster, center.x-30, center.y-30, "50", "50")
				}
            }
			else if (board[i][j] == 10) //draw heart
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

function UpdatePosition()
 {
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

	// 5 point food
	if (board[shape.i][shape.j] == 1) {
		score = score + 5;
	}
	// 15 point food
	if (board[shape.i][shape.j] == 2) {
		score = score + 15;
	}
	// 25 point food
	if (board[shape.i][shape.j] == 3) {
		score = score + 25;
	}

	else if(board[shape.i][shape.j] == 10)
	{
		num_of_lives += 1
		board[shape.i][shape.j] = 0
	}
	board[shape.i][shape.j] = 9;


	// Move the monsters every "monsterMovementMs" seconds
	if(Date.now() - monsterTimeout >= monsterMovementMs)
	{
    	updateMonsterPositions()
		monsterTimeout = Date.now()
	}

	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
	if (score >= 10000) ///////////////////////////////////////////////////////
	{
		window.clearInterval(interval);
		winnerMusic.play(); // Play winner Music
		showAndHideDivs('gamewinner_screen')
	}
	if(time_elapsed >= timeForGame)
	{
		gameOver("t")
	}
	else 
	{
		Draw();
	}
}

function updateSpecialFoodPosition(){
	let curr_i = special_food.i
	let curr_j = special_food.j
	let random_step = Math.floor((Math.random() * 4) + 0)
	switch(random_step)
	{
		case ('0'):
			if (is_valid_move(curr_i+1, curr_j))
			{
				special_food.i = curr_i + 1
				board
			}

		case ('1'):

		case ('2'):

		case ('3'):

	}
}

function updateMonsterPositions()
{
    let movement_1;
    let movement_2;
    let movement_3;
    let movement_4;
	switch(numOfMonsters)
	{    
		case("4"):
			movement_1 = predict_best_moves(shape, monster_1)
			movement_2 = predict_best_moves(shape, monster_2)
			movement_3 = predict_best_moves(shape, monster_3)
			movement_4 = predict_best_moves(shape, monster_4)
			updateMonsterPose(monster_1, movement_1, board[monster_1.i][monster_1.j] - 5, false) // the difference between passage/food with and without a monster on it is 5 
			updateMonsterPose(monster_2, movement_2, board[monster_2.i][monster_2.j] - 5, false) // for example, if i had 6 (5P food with monster on it) than i will have 1 at the end (only 5P food)
			updateMonsterPose(monster_3, movement_3, board[monster_3.i][monster_3.j] - 5, false)
			updateMonsterPose(monster_4, movement_4, board[monster_4.i][monster_4.j] - 5, true)
			break;
		case("3"):
            movement_1 = predict_best_moves(shape, monster_1)
			movement_2 = predict_best_moves(shape, monster_2)
			movement_3 = predict_best_moves(shape, monster_3)
			updateMonsterPose(monster_1, movement_1, board[monster_1.i][monster_1.j] - 5, false)
			updateMonsterPose(monster_2, movement_2, board[monster_2.i][monster_2.j] - 5, true)
			updateMonsterPose(monster_3, movement_3, board[monster_3.i][monster_3.j] - 5, false)
			break;
		case("2"):
			movement_1 = predict_best_moves(shape, monster_1)
			movement_2 = predict_best_moves(shape, monster_2)
			updateMonsterPose(monster_1, movement_1, board[monster_1.i][monster_1.j] - 5, false)
			updateMonsterPose(monster_2, movement_2, board[monster_2.i][monster_2.j] - 5, false)
			break;
		case("1"):
            movement_1 = predict_best_moves(shape, monster_1)
			updateMonsterPose(monster_1, movement_1, board[monster_1.i][monster_1.j] - 5, false)
			break;
	}
}

function updateMonsterPose(monster, movements, cellValue, isSpaciel)
{
	for(let i = 0; i < movements.length; i++)
	{
		switch(movements[i])
		{
			// UP
			case 1:
				if(is_valid_move(monster.i - 1, monster.j))
				{
					board[monster.i][monster.j] = cellValue // set current cell value
					setMonsterOnCell(monster.i - 1, monster.j, monster, isSpaciel) // set new cell value
					return;
				}
				break;
			// DOWN
			case 2:
				if(is_valid_move(monster.i + 1, monster.j))
				{
					board[monster.i][monster.j] = cellValue // set current cell value
					setMonsterOnCell(monster.i + 1, monster.j, monster, isSpaciel) // set new cell value
					return;
				}
				break;
			// RIGHT
			case 3:
				if(is_valid_move(monster.i, monster.j + 1))
				{
					board[monster.i][monster.j] = cellValue // set current cell value
					setMonsterOnCell(monster.i, monster.j + 1, monster, isSpaciel) // set new cell value
					return;
				}
				break;
			// LEFT
			case 4:
				if(is_valid_move(monster.i, monster.j - 1))
				{
					board[monster.i][monster.j] = cellValue // set current cell value
					setMonsterOnCell(monster.i, monster.j - 1, monster, isSpaciel) // set new cell value
					return;
				}
				break;
		}
        
	}
}
	


function setMonsterOnCell(i, j, monster, isSpaciel)
{
	if(board[i][j] == 0)
    {
		board[i][j] = 5 // monster on empty cell
        monster.i = i;
        monster.j = j;
    }
	else if(board[i][j] == 1) 
	{
        board[i][j] = 6 // monster on cell with 5 point food
        monster.i = i;
        monster.j = j;
    }
	else if(board[i][j] == 2) 
	{
        board[i][j] = 7 // monster on cell with 15 point food
        monster.i = i;
        monster.j = j;
    }
	else if(board[i][j] == 3) 
	{
        board[i][j] = 8 // monster on cell with 25 point food
        monster.i = i;
        monster.j = j;
    }
	//TODO how do we want to treat a monster on a heart cell???????????
	else // monster on cell with pacman!

	{
        collision(isSpaciel)
	}

    
}


function is_valid_move(i, j)
{
	let possible = [0, 1, 2, 3, 9]
	return ((i >= 0 || i < board.length) && (j >= 0 || j < board[0].length) && (board[i][j] != 4) && (board[i][j] != 5) && (board[i][j] != 6))
}



function predict_best_moves(pacman, monster){
    let result = [];
    diff_i = pacman.i - monster.i;
    diff_j = pacman.j - monster.j;

    // UP/DOWN first
    if (Math.abs(diff_i) > Math.abs(diff_j))
	{ 
        //DOWN
        if (diff_i > 0){
            result[0] = 2;
            // RIGHT is better than DOWN
            if (diff_j > 0){
                result[1] = 3;
                result[2] = 4;
            }
            // LEFT and then RIGHT (if diff_j == 0 it doesn't matter if going left or right)
            else{
                result[1] = 4;
                result[2] = 3;
            }
            // UP is the worst option
            result[3] = 1;
        }

        //UP
        else{
            result[0] = 1
            // RIGHT is better than LEFT
            if (diff_j > 0){
                result[1] = 3;
                result[2] = 4;
            }
            // LEFT and then RIGHT (if diff_j == 0 it doesn't matter if going left or right)
            else{
                result[1] = 4;
                result[2] = 3;
            }
            // DOWN is the worst option
            result[3] = 2;
        }
    }

    // LEFT/RIGHT first
    else{
        //RIGHT
        if (diff_j > 0){
            result[0] = 3;
            //DOWN is better than UP
            if (diff_i > 0){
                result[1] = 2;
                result[2] = 1;
            }
            //UP and then DOWN (if diff_i == 0 it doesn't matter if going up or down)
            else{
                result[1] = 1;
                result[2] = 2;
            }
            //LEFT is the worst option
            result[3] = 4;
        }

        //LEFT
        else{
            result[0] = 4;
            //DOWN is better than UP
            if (diff_i > 0){
                result[1] = 2;
                result[2] = 1;
            }
            //UP and then DOWN (if diff_i == 0 it doesn't matter if going up or down)
            else{
                result[1] = 1;
                result[2] = 2;
            }
            //RIGHT is the worst option
            result[3] = 3;
        }
    }
    return result
}

function gameOver(end_game_reason)
{
	if(end_game_reason == 'd') // died (monster eat the pacman)
	{
		$('#gameover_text').html("You have lost the game!" + '<br>' + "You have been eaten by the monsters five times.." + '<br>'+ '<br>'+ '<br>')
		showAndHideDivs('gameover_screen')
	}
	else if(end_game_reason == 't') // time over
	{
		$('#gameover_text').html("You have lost the game!" + '<br>' + "The time is over.." + '<br>'+ '<br>'+ '<br>')
		showAndHideDivs('gameover_screen')
	}
	gameOverMusic.play(); // play GameOver music
	return;
}

function collision(isSpaciel)
{

	num_of_lives--;
	score = Math.max(0, score - 10);

	if(isSpaciel) // check if it's the spaciel monster
	{
		num_of_lives--;
		score = Math.max(0, score - 10);
	}

	if (num_of_lives <= 0)
    {
		clearInterval(interval)
		gameOver('d')
		return;
    }
    else
    {
		if((num_of_lives == 1) && (!lifeFlag)) // check if we need to add a bonus live
		{
			let indexArr = [[2, 2], [8, 8], [2, 8], [8, 2]];
			let randNum = Math.floor((Math.random() * 4) + 0)
			lifeFlag = true;
			board[indexArr[randNum][0]][indexArr[randNum][1]] = 10;
		}
    
        //Resets the monsters to the corners of the map
        let monster_positions = [[0,0], [9,9],[0,9],[9,0]]

        for(let num_monst = 0; num_monst < numOfMonsters; num_monst++)
        {
            //Update the cell where the monster were to be a passage or food
            if(board[monster_list[num_monst].i][monster_list[num_monst].j] == 5) //passage
            {
                board[monster_list[num_monst].i][monster_list[num_monst].j] = 0;
            }
            else if (board[monster_list[num_monst].i][monster_list[num_monst].j] == 6) // 5 point food
            {
                board[monster_list[num_monst].i][monster_list[num_monst].j] = 1;
            }
			else if (board[monster_list[num_monst].i][monster_list[num_monst].j] == 7)// 15 point food
            {
                board[monster_list[num_monst].i][monster_list[num_monst].j] = 2;
            }
			else if (board[monster_list[num_monst].i][monster_list[num_monst].j] == 8)// 25 point food
            {
                board[monster_list[num_monst].i][monster_list[num_monst].j] = 3;
            }
			
            board[monster_positions[num_monst][0]][monster_positions[num_monst][1]] = 5;
            monster_list[num_monst].i = monster_positions[num_monst][0];
            monster_list[num_monst].j = monster_positions[num_monst][1];
            
        }

        // Resets the pacman in a random location (midfield)
        let rand_pacman_i;
        let rand_pacman_j;
        do{
            rand_pacman_i = Math.floor((Math.random() * 4) + 3)
            rand_pacman_j = Math.floor((Math.random() * 4) + 3)

        }
        while(!is_valid_move(rand_pacman_i, rand_pacman_j))
        
        board[shape.i][shape.j] = 0;
        shape.i = rand_pacman_i;
        shape.j = rand_pacman_j;
        board[rand_pacman_i][rand_pacman_j] = 9;


    }
}


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

function update_5_point_food()
{
	food_5_point_color = $('#5_point_color').val()
}

function update_15_point_food()
{
	food_15_point_color = $('#15_point_color').val()
}

function update_25_point_food()
{
	food_25_point_color = $('#25_point_color').val()
}

function setTableBorder(num)
{
	let gameTable = $("#settingsAndGame");
	gameTable.attr('border', num);
}

function updateLogeedUser()
{
	$('#player_name').html('<h2 style="color: #3399ff;">' + "Player Name: " + connectedPlayer + '</h2>' + '<br>')
}

function startMusic()
{
	gameMusic.loop = true;
	gameMusic.play();
}

function stopWinnerMusic()
{
	winnerMusic.pause();
	winnerMusic.currentTime = 0;	
}

function stopGameOverMusic()
{
	gameOverMusic.pause();
	gameOverMusic.currentTime = 0;	
}

function randomizeWalls(i, j, randWall) // [[2, 2], [8, 8], [2, 8], [8, 2]]
{
	let wallsList = [[[3,3], [3,4],[3,5],[6,1],[6,2], [2,5], [7,7], [2,7]], [[5,5], [5,6],[7,5],[3,7],[4,4], [2,5], [3,3], [7,8], [7,2], [6,3]], [[7,7], [4,4],[7,6],[2,7],[6,6], [2,3],[1,6], [7,3], [8,3],[7,4]], [[5,6], [6,5],[3,3],[7,7],[6,2],[2,3],[4,4], [2,7], [2,8]]]
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