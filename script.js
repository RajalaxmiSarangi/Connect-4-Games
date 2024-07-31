//initial references
const container = document.querySelector(".container");
const playerTurn = document.getElementById("playerTurn");
const startScreen = document.querySelector(".startScreen");
const startButton = document.getElementById("start");
const message = document.getElementById("message");
let initialMatrix = [
     [0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0],
];
let currentPlayer;

//Random number between range
const generateRandomNumber = (min,max) =>
     Math.floor(Math.random() * (max - min)) + min;

//Loop through array and check for same values
const verifyArray = (arrayElement) => {
     let bool = false;
     let elementCount = 0;
     arrayElement.forEach((element, index) => {
          if(element == currentPlayer){
               elementCount += 1;
               if(elementCount == 4){
                    bool = true;
               }
          }
          else{
               elementCount = 0;
          }
     });
     return bool;
};

//Check for Game Over
const gameOverCheck = () => {
     let truthCount = 0;
     for(let innerArray of initialMatrix){
          if(innerArray.every((val) => val != 0)){
               truthCount += 1;
          }
          else{
               return false;
          }
     }
     if(truthCount == 6){
          message.innerText = "Game Over";
          startScreen.classList.remove("hide");
     }
};

//check rows
const checkAdjacentRowValues = (row) => {
     return verifyArray(initialMatrix[row]);
};

//check columns
const checkAdjacentColumnValues = (column) => {
     let colWinCount = 0;
     colWinBool = false;
     initialMatrix.forEach((element, index) => {
          if (element[column] == currentPlayer) {
               colWinCount += 1;
               if(colWinCount == 4){
                    colWinBool = true;
               }    
          }
          else{
               colWinCount = 0;
          }
     });
     //no match
     return colWinBool;
};

//Get Right Diagonal Values
const getRightDiagonal = (row, column, rowLength, columnLength) => {
     let rowCount = row;
     let columnCount = column;
     let rightDiagonal  = [];
     while(rowCount > 0){
          if(columnCount >= columnLength-1) {
               break;
          }
          rowCount -= 1;
          columnCount += 1;
          rightDiagonal.unshift(initialMatrix[rowCount][columnCount]);         
     }
     rowCount = row;
     columnCount = column;
     while (rowCount < rowLength) {
          if (columnCount < 0) {
               break;
          }
          rightDiagonal.push(initialMatrix[rowCount][columnCount]);
          rowCount += 1;
          columnCount -= 1;
     }
     return rightDiagonal;
};

//Get Left Diagonal Values
const getLeftDiagonal = (row, column, rowLength, columnLength) => {
     let rowCount = row;
     let columnCount = column;
     let leftDiagonal  = [];
     while(rowCount > 0){
          if(columnCount <= 0) {
               break;
          }
          rowCount -= 1;
          columnCount -= 1;
          leftDiagonal.unshift(initialMatrix[rowCount][columnCount]);         
     }
     rowCount = row;
     columnCount = column;
     while (rowCount < rowLength) {
          if (columnCount >= columnLength) {
               break;
          }
          leftDiagonal.push(initialMatrix[rowCount][columnCount]);
          rowCount += 1;
          columnCount += 1;
     }
     return leftDiagonal;
};


//check diagonals
const checkAdjacentDiagonalValues = (row, column) => {
     let diagWinBool = false;
     let tempChecks = {
          leftTop: [],
          rightTop: [],
     };
     let columnLength = initialMatrix[row].length;
     let rowLength = initialMatrix.length;
     //Store left and right diagonal array
     tempChecks.leftTop = [
          ...getLeftDiagonal(row, column, rowLength, columnLength),
     ];
     tempChecks.rightTop = [
          ...getRightDiagonal(row, column, rowLength, columnLength),
     ]; 
     //check both arrays for similarities
     diagWinBool = verifyArray(tempChecks.rightTop);
     if(!diagWinBool){
          diagWinBool = verifyArray(tempChecks.leftTop);
     }
     return diagWinBool;
};

//Win check logic
const winCheck = (row, column) => {
     //if any of the functions return true we return true
     return checkAdjacentRowValues(row) 
     ? true 
     : checkAdjacentColumnValues(column) 
     ? true 
     : checkAdjacentDiagonalValues(row, column) 
     ? true 
     : false;
};

//Sets the circle to exact points
const setPiece = (startCount, colValue) => {
     let rows = document.querySelectorAll(".grid-row");
     /*Initially it will place the circles in the last row else if no place 
     available we will decreament the count until we find empty slot*/
     if (initialMatrix[startCount][colValue] != 0) {
          startCount -=1;
          setPiece(startCount, colValue);
     } else {
         //place circle
         let currentRow = rows[startCount].querySelectorAll(".grid-box");
         currentRow[colValue].classList.add("filled",`player${currentPlayer}`);
         //update Matrix
         initialMatrix[startCount][colValue] = currentPlayer;
         //Check for wins
         if (winCheck(startCount, colValue)) {
          message.innerHTML = `<h2>Player<span> ${currentPlayer}</span> wins</h2>`;
          startScreen.classList.remove("hide");
          return false;
         }
     }
     //check if all are full
     gameOverCheck();
};

//when user click on a box
const fillBox = (e) => {
     //get column value
     let colValue = parseInt(e.target.getAttribute("data-value"));
     //5 because we have 6 rows (0-5)
     setPiece(5, colValue);
     currentPlayer = currentPlayer == 1 ? 2 : 1;
     playerTurn.innerHTML = `Player <span>${currentPlayer}'s</span> turn`;

};

//create matrix
const matrixCreater = () => {
     for (let innerarray in initialMatrix){
          let outerDiv = document.createElement("div");
          outerDiv.classList.add("grid-row");
          outerDiv.setAttribute("data-value", innerarray);
          for(let j in initialMatrix[innerarray]){
               //set all matrix values to 0
               initialMatrix[innerarray][j] = [0];
               let innerDiv = document.createElement("div");
               innerDiv.classList.add("grid-box");
               innerDiv.setAttribute("data-value", j);
               innerDiv.addEventListener("click", (e) => {
                    fillBox(e);
               });
               outerDiv.appendChild(innerDiv);   
          }
          container.appendChild(outerDiv);
     }
};

//Initialize Game
window.onload = startGame = async () => {
     //Between 1 and 2
     currentPlayer = generateRandomNumber(1, 3);
     container.innerHTML = "";
     await matrixCreater();
     playerTurn.innerHTML = `Player <span>${currentPlayer}'s</span> turn`;
};

//Start Game
startButton.addEventListener("click", () => {
     startScreen.classList.add("hide");
     startGame();
});