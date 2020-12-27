let mainBoad;
const humanPlayer = '0';
const compPlayer = 'X';

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

const cells = document.querySelectorAll('.cell');

startGame();

function startGame(){
    document.querySelector('.endgame').style.display = 'none';
    mainBoad = Array.from(Array(9).keys());
    for(let i = 0; i < cells.length; i++){
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', clikedCell, false);
    }
}
function clikedCell(square){
    if(typeof(mainBoad[square.target.id] === 'number')){
        myTurn(square.target.id, humanPlayer);
        if(!findTie()){
           myTurn(compSport(), compPlayer);
        }
    }
}

function myTurn(squireId, player){
    mainBoad[squireId] = player;
    document.getElementById(squireId).innerText = player;
    let gameWon = findWin(mainBoad, player);
    if(gameWon){
        gameOver(gameWon);
    }
}

function findWin(board, player){
    let plays = board.reduce((accumulator, element, index) => (element === player) ? accumulator.concat(index) : accumulator, []);
    let gameWon = null;
    for(let [index, win] of winningCombinations.entries()){
        if(win.every(element => plays.indexOf(element) > -1)){
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon){
    for(let index of winningCombinations[gameWon.index]){
        document.getElementById(index).style.backgroundColor = gameWon.player === humanPlayer ? 'green' : 'red';
    }

    for(let i = 0; i < cells.length; i++){
        cells[i].removeEventListener('click', clikedCell, false);
    }
    getWinner(gameWon.player === humanPlayer ? 'You Win!' : 'You Lose!');
}

function emptySquares(){
    return mainBoad.filter(e => typeof e === 'number');
}
function compSport(){
    return minimax(mainBoad, compPlayer).index;
}
function findTie(){
    if(emptySquares().length === 0){
        for(let i = 0; i < cells.length; i++){
            cells[i].style.backgroundColor = 'blue';
            cells[i].removeEventListener('click', clikedCell, false);
        }
        getWinner('It is a tie!');
        return true;
    }
    return false;
}
function getWinner(winner){
    document.querySelector('.endgame').style.display = 'block';
    document.querySelector('.endgame .text').innerText = winner;
}

function minimax(newBoard, player){
    let availableSport = emptySquares(newBoard);

    if(findWin(newBoard, player)){
        return {score: -10};
    }else if(findWin(newBoard, compPlayer)){
        return {score: 20};
    }else if(availableSport.length === 0){
        return {score: 0};
    }

    let moves = [];
    for(let i = 0; i < availableSport.length; i++){
        let move = {};
        move.index = newBoard[availableSport[i]];
        newBoard[availableSport[i]] = player;

        if(player === compPlayer){
            let result = minimax(newBoard, humanPlayer);
            move.score = result.score;
        }else{
            let result = minimax(newBoard, compPlayer);
            move.score = result.score;
        }

        newBoard[availableSport[i]] = move.index;

        moves.push(move);
    }

    let bestMove;
    if(player === compPlayer){
        let bestScore = -10000;
        for(let i = 0; i < moves.length; i++){
            if(moves[i].score > bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }else{
        let bestScore = 10000;
        for(let i = 0; i < moves.length; i++){
            if(moves[i].score < bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}