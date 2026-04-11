const cells = document.querySelectorAll(".cell");
let game = GameController();
let gameStarted = false;
const startBtn = document.querySelector("#startBtn");
const restartBtn = document.querySelector("#restartBtn");
const resultDiv = document.querySelector(".result");
const buttons = document.querySelectorAll("button");
const clickSound = new Audio("./click.wav")
buttons.forEach((button)=>{
    button.addEventListener("click",()=>{
    clickSound.play();
})});
startBtn.addEventListener("click",()=>{
    clickSound.currentTime = 0;
    const player1 = prompt("Enter Player one's Name: ","Player1") || "Player1";
    const player2 = prompt("Enter player two's name:","Player2") ||"Player2";
    game = GameController(player1,player2);
    gameStarted=true;
    startBtn.disabled = true;
})

restartBtn.addEventListener("click",()=>{
    game = GameController();
    gameStarted = false;
    startBtn.disabled = false;
    cells.forEach((cell)=>{
        cell.textContent ='';
        resultDiv.innerHTML='';
    })
})
cells.forEach((cell)=>{
    cell.addEventListener("click",()=>{
        if(!gameStarted) return;
        const row = Number(cell.dataset.row);
        const column = Number(cell.dataset.col);

        console.log(row,column);
        const result = game.playRound(row,column);
        if(!result) return;
        if(result.player){
            cell.textContent= result.player.token;
        }
        if(result.winner){
            resultDiv.innerHTML = `${result.player.name} wins 🎉🎉`
        }
        if(result.draw){
           resultDiv.innerHTML = `It's a draw!`;
        }
        
    })
    
})
function Gameboard(){
    let rows = 3;
    let columns = 3;
    let board = [];

    for (let i = 0; i<rows;i++){
        board[i]=[];
        for(let j=0;j<columns;j++){
            board[i].push(Cell());
        }
    }

    const getBoard = ()=> board;
    
    const placeToken = (row,column,player)=>{
        if(board[row][column].getValue()!=0){
            return false;
        }
        board[row][column].addToken(player);
        return true;
    }
    const isFull = ()=>{
        for(let i=0;i<rows;i++){
            for(let j=0;j<columns;j++){
                if(board[i][j].getValue()===0){
                    return false;
                }
            }
        }
        return true;
    }
    const checkWinner=()=>{
        //rows
        for(let i=0;i<rows;i++){
            const a = board[i][0].getValue();
            const b = board[i][1].getValue();
            const c = board[i][2].getValue();
            if(a===b && b===c && a!==0){
                return a;
            }
        }
        //columns
        for(let i=0;i<columns;i++){
            const a = board[0][i].getValue();
            const b = board[1][i].getValue();
            const c = board[2][i].getValue();
            if(a===b && b===c && a!==0){
                return a;
            }
        }
        //Diagonal1
        const d1 = board[0][0].getValue();
        const d2 = board[1][1].getValue();
        const d3 = board[2][2].getValue();
        //Diagonal2
        const e1 = board[0][2].getValue();
        const e2 = board[1][1].getValue();
        const e3 = board[2][0].getValue();
        if(d1===d2 && d2===d3 &&d1!=0){
            return d1;
        }
        if(e1===e2 && e2===e3 &&e1!=0){
            return e1;
        }
        return null;

       };
    return {getBoard,placeToken,checkWinner,isFull};
}

function Cell(){
    let value = 0;
    const addToken=(player)=>{
        value = player;
    }
    const getValue= ()=> value;

    return{
        addToken,
        getValue
    };
}

function GameController(player1,player2){
    const board = Gameboard();
    const players = [
        {name:player1, token:"X"},
        {name:player2, token:"O"}
    ];
    let activePlayer = players[0];
    let gameOver = false;
    const switchPlayer = ()=>{
        activePlayer = activePlayer === players[0]? players[1]: players[0];
    };
    const playRound=(row,column)=>{
        if(gameOver) return null;
        const success = board.placeToken(row,column,activePlayer.token);
        if(!success){
            return null;
        }
        const currentPlayer = activePlayer;
        const winner = board.checkWinner();
        if(winner){
            gameOver=true;
            return {player: currentPlayer, winner:true} ;
        }
        if(board.isFull()){
            gameOver = true;
            return{ player: currentPlayer, draw:true };
        }
        switchPlayer();
        return{player: currentPlayer, winner: false};
    };
    return{
        playRound
    };
    
}


