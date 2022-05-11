



function draw_monsters(numOfMonsters){

}

// UP - 1
// DOWN - 2
// RIGHT - 3
// LEFT - 4
function predict_best_moves(pacman, monster){
    let result = [];
    diff_i = pacman.i - monster.i;
    diff_j = pacman.j - monster.j;

    // UP/DOWN first
    if (Math.abs(diff_i) > Math.abs(diff_j)){ 
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