base_image = new Image();
base_image.src = "https://icon2.cleanpng.com/20180203/ftq/kisspng-pac-man-world-3-ghosts-clip-art-pac-man-ghost-png-transparent-image-5a7561ae052b06.0298581815176421580212.jpg"


function Start() {
	clearInterval(interval)
	board = new Array();
	score = 0;
	pauseCounter = 0;
	pauseAndResumeBtn = document.getElementById('pauseResume');
	pauseAndResumeBtn.textContent = 'Pause';
	monsterMovementMs = 700; // defualt mode is Easy
	pac_color = "yellow";
    num_of_lives = 5;
	var cnt = 100;
	var food_remain = numOfBalls;
	var pacman_remain = 1;
	setTableBorder('1') // set the table border
	start_time = new Date();
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 10; j++) 
		{
            if (//Reserved places for the monsters
                (i == 0 && j == 0) ||
                (i == 0 && j == 9) ||
                (i == 9 && j == 0) ||
                (i == 9 && j == 9)){
                    continue
                }

			if (
				(i == 3 && j == 3) ||
				(i == 3 && j == 4) ||
				(i == 3 && j == 5) ||
				(i == 6 && j == 1) ||
				(i == 6 && j == 2)) 
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

	// put the monsters in the board
	let monster_positions = [[0,0], [9,9],[0,9],[9,0]]
	for(let num_monst = 0; num_monst < numOfMonsters; num_monst++){
        // check if this position is empty
		if(board[monster_positions[num_monst][0]][monster_positions[num_monst][1]] == 0)
		{	
			board[monster_positions[num_monst][0]][monster_positions[num_monst][1]] = 5 // monster on empty cell
		}
		else
		{
			board[monster_positions[num_monst][0]][monster_positions[num_monst][1]] = 6 // monster on coin cell
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
    
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
            //draw pacman
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
            else if (board[i][j] == 5 || board[i][j] == 6){
                base_image.width = "60"
                context.drawImage(base_image, center.x-30, center.y-30, "60", "60")
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
	if (board[shape.i][shape.j] == 1) {
		score++;
	}
	board[shape.i][shape.j] = 2;


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
	if (score == 50) {
		window.clearInterval(interval);
		window.alert("Game completed");
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
			updateMonsterPose(monster_1, movement_1, board[monster_1.i][monster_1.j] - 5) // the diffrence between passage with/without monster on it and coin with/without monster on it is 5 
			updateMonsterPose(monster_2, movement_2, board[monster_2.i][monster_2.j] - 5) // for example, if i had 6 (coin with monster on it) than i will have 1 at the end (only coin)
			updateMonsterPose(monster_3, movement_3, board[monster_3.i][monster_3.j] - 5)
			updateMonsterPose(monster_4, movement_4, board[monster_4.i][monster_4.j] - 5)
			break;
		case("3"):
            movement_1 = predict_best_moves(shape, monster_1)
			movement_2 = predict_best_moves(shape, monster_2)
			movement_3 = predict_best_moves(shape, monster_3)
			updateMonsterPose(monster_1, movement_1, board[monster_1.i][monster_1.j] - 5)
			updateMonsterPose(monster_2, movement_2, board[monster_2.i][monster_2.j] - 5)
			updateMonsterPose(monster_3, movement_3, board[monster_3.i][monster_3.j] - 5)
			break;
		case("2"):
			movement_1 = predict_best_moves(shape, monster_1)
			movement_2 = predict_best_moves(shape, monster_2)
			updateMonsterPose(monster_1, movement_1, board[monster_1.i][monster_1.j] - 5)
			updateMonsterPose(monster_2, movement_2, board[monster_2.i][monster_2.j] - 5)
			break;
		case("1"):
            movement_1 = predict_best_moves(shape, monster_1)
			updateMonsterPose(monster_1, movement_1, board[monster_1.i][monster_1.j] - 5)
			break;
	}
}

function updateMonsterPose(monster, movements, cellValue)
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
					setMonsterOnCell(monster.i - 1, monster.j, monster) // set new cell value
					return;
				}
				break;
			// DOWN
			case 2:
				if(is_valid_move(monster.i + 1, monster.j))
				{
					board[monster.i][monster.j] = cellValue // set current cell value
					setMonsterOnCell(monster.i + 1, monster.j, monster) // set new cell value
					return;
				}
				break;
			// RIGHT
			case 3:
				if(is_valid_move(monster.i, monster.j + 1))
				{
					board[monster.i][monster.j] = cellValue // set current cell value
					setMonsterOnCell(monster.i, monster.j + 1, monster) // set new cell value
					return;
				}
				break;
			// LEFT
			case 4:
				if(is_valid_move(monster.i, monster.j - 1))
				{
					board[monster.i][monster.j] = cellValue // set current cell value
					setMonsterOnCell(monster.i, monster.j - 1, monster) // set new cell value
					return;
				}
				break;
		}
        
	}
}
	


function setMonsterOnCell(i, j, monster)
{
	if(board[i][j] == 0)
    {
		board[i][j] = 5 // monster on empty cell
        monster.i = i;
        monster.j = j;
    }
	else if(board[i][j] == 1) 
	{
        board[i][j] = 6 // monster on cell with coin
        monster.i = i;
        monster.j = j;
    }	
	else // monster on cell with pacman!

	{
        collision()
	}

    
}

function is_valid_move(i, j)
{
	return ((i >= 0 || i < board.length) && (j >= 0 || j < board[0].length) && (board[i][j] == 0 || board[i][j] == 1 ||board[i][j] == 2))
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
		return;
}

function collision()
{
    if (num_of_lives == 1)
    {
		clearInterval(interval)
		gameOver('d')
		return;
    }
    else
    {
        num_of_lives--;
        score = Math.max(0, score - 10);
    
        //Resets the monsters to the corners of the map
        let monster_positions = [[0,0], [9,9],[0,9],[9,0]]

        for(let num_monst = 0; num_monst < numOfMonsters; num_monst++)
        {
            //Update the cell where the monster were to be a passage or food
            if(board[monster_list[num_monst].i][monster_list[num_monst].j] == 5)
            {
                board[monster_list[num_monst].i][monster_list[num_monst].j] = 0;
            }
            else
            {
                board[monster_list[num_monst].i][monster_list[num_monst].j] = 1;
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
        board[rand_pacman_i][rand_pacman_j] = 2;


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
			monsterMovementMs = 700;
			break;
		case "medium":
			monsterMovementMs = 500;
			break;
		case "hard":
			monsterMovementMs = 300;
			break;
	}
}

function setTableBorder(num)
{
	let gameTable = $("#settingsAndGame");
	gameTable.attr('border', num);
}


// add the functiounality that after choose a mode................