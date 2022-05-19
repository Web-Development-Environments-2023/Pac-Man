let red_monster = new Image();
red_monster.src = "/resources/images/red ghost.png"
let pink_monster = new Image();
pink_monster.src =  "/resources/images/pink ghost.png"

// Function that updates the monsters positions
function updateMonsterPositions()
{
    let movement_1;
    let movement_2;
    let movement_3;
    let movement_4; 

	// For each monster, generate a list of the best moves that a monster can do to get close to the pacman
	// Then, updates the monster position with that list (tries the best move and if impossible tries 2nd best etc..)
	switch(numOfMonsters)
	{    
		// 4 monsters
		case("4"):
			movement_1 = predict_best_moves(shape, monster_1)
			movement_2 = predict_best_moves(shape, monster_2)
			movement_3 = predict_best_moves(shape, monster_3)
			movement_4 = predict_best_moves(shape, monster_4)
			updateMonsterPose(monster_1, movement_1, board[monster_1.i][monster_1.j] - 5, false) // the difference between passage/food with and without a monster on it is 5 
			updateMonsterPose(monster_2, movement_2, board[monster_2.i][monster_2.j] - 5, false) // for example, if i had 6 (5P food with monster on it) than i will have 1 at the end (only 5P food)
			updateMonsterPose(monster_3, movement_3, board[monster_3.i][monster_3.j] - 5, true)
			updateMonsterPose(monster_4, movement_4, board[monster_4.i][monster_4.j] - 5, false)
			break;
		// 3 monsters
		case("3"):
            movement_1 = predict_best_moves(shape, monster_1)
			movement_2 = predict_best_moves(shape, monster_2)
			movement_3 = predict_best_moves(shape, monster_3)
			updateMonsterPose(monster_1, movement_1, board[monster_1.i][monster_1.j] - 5, false)
			updateMonsterPose(monster_2, movement_2, board[monster_2.i][monster_2.j] - 5, false)
			updateMonsterPose(monster_3, movement_3, board[monster_3.i][monster_3.j] - 5, true)
			break;
		// 2 monsters
		case("2"):
			movement_1 = predict_best_moves(shape, monster_1)
			movement_2 = predict_best_moves(shape, monster_2)
			updateMonsterPose(monster_1, movement_1, board[monster_1.i][monster_1.j] - 5, false)
			updateMonsterPose(monster_2, movement_2, board[monster_2.i][monster_2.j] - 5, false)
			break;
		// 1 monster
		case("1"):
            movement_1 = predict_best_moves(shape, monster_1)
			updateMonsterPose(monster_1, movement_1, board[monster_1.i][monster_1.j] - 5, false)
			break;
	}
}


// Function that updates a monster position based on a list of best movements it can do
function updateMonsterPose(monster, movements, cellValue, isSpaciel)
{
	// Iterates on the list of movements
	for(let i = 0; i < movements.length; i++)
	{
		switch(movements[i])
		{
			// UP
			case 1:
				//Checks that the move is possible
				if(is_valid_move(monster.i - 1, monster.j))
				{
					board[monster.i][monster.j] = cellValue // set current cell value
					setMonsterOnCell(monster.i - 1, monster.j, monster, isSpaciel) // set new cell value
					return;
				}
				break;
			// DOWN
			case 2:
				//Checks that the move is possible
				if(is_valid_move(monster.i + 1, monster.j))
				{
					board[monster.i][monster.j] = cellValue // set current cell value
					setMonsterOnCell(monster.i + 1, monster.j, monster, isSpaciel) // set new cell value
					return;
				}
				break;
			// RIGHT
			case 3:
				//Checks that the move is possible
				if(is_valid_move(monster.i, monster.j + 1))
				{
					board[monster.i][monster.j] = cellValue // set current cell value
					setMonsterOnCell(monster.i, monster.j + 1, monster, isSpaciel) // set new cell value
					return;
				}
				break;
			// LEFT
			case 4:
				//Checks that the move is possible
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
	
// Function that sets a monster on a cell of the board
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
	
	else // monster on cell with pacman!
	{
        collision(isSpaciel)
	}
}

// Function that returns a list of best moves that a given monster can do to reach the pacman
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

// Function that change the state of the app to be in 'game Over' state
function gameOver(end_game_reason)
{
	if(end_game_reason == 'd') // died (monster eat the pacman)
	{
		$('#gameover_text').html("You have lost the game!" + '<br>' + "No lives have left.." + '<h1>' + "Loser!" + '</h1>' + '<br>')
		showAndHideDivs('gameover_screen')
	}
	else if(end_game_reason == 't') // time over
	{
		if(score < 100)
		{
			$('#gameover_text').html("You have lost the game!" + '<br>' + "The time is over.." + '<h2>' + "You are better than " + score + " points!" + '</h2>' + '<br>')
			showAndHideDivs('gameover_screen')
		}
		else
		{
			$('#gameover_text').html("You have gained more than 100 points!" + '<br>' + "The time is over.." + '<h2>' + "Winner!!!" + '</h2>' + '<br>')
			showAndHideDivs('gameover_screen')
		}
	}
	gameOverMusic.play(); // play GameOver music
	return;
}

// Function that handles a collision between the pacman and a monster - updates score and number of lives and finishes the game if needed
function collision(isSpaciel)
{
	num_of_lives--;
	score = Math.max(0, score - 10);

	if(isSpaciel) // check if it's the special monster
	{
		num_of_lives--;
		score = Math.max(0, score - 10);
	}

	// Check if the pacman is dead
	if (num_of_lives <= 0)
    {
		clearInterval(interval)
		gameOver('d')
		return;
    }

	// Generate an extra life if reached 1 last live
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
			
            board[monster_positions[num_monst][0]][monster_positions[num_monst][1]] += 5;
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


// Function that returns the type of the monster that is on the given row and col
function regularOrSpaciel(row, col)
{
	if(monster_1.i == row && monster_1.j == col)
	{
		return  monster_1.type;
	}
	else if (monster_2.i == row && monster_2.j == col)
	{
		return  monster_2.type;
	}
	else if (monster_3.i == row && monster_3.j == col)
	{
		return  monster_3.type;
	}
	else if (monster_4.i == row && monster_4.j == col)
	{
		return  monster_4.type;
	}
}




// Helper function that checks if the current position is not one of the monster's initial position (0,0), (0,9), (9,0), (9,9)
function not_on_monster_places(i, j)
{
	if ((i == 0 & j == 0) || (i == 9 & j == 0) || (i == 0 & j == 9) || (i == 9 & j == 9))
	{
		return false
	}
	else
	{
		return true
	}
}