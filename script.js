let mines = document.querySelectorAll('.box');
const mode = document.querySelector('#modes');
let mineContainer = document.querySelector(".mine-container");
let matrix = [];
let mrow = 6;
let mcol = 6;
updateMatrix();
adjectCell();
let loose = document.querySelector(".try-again");
let win = document.querySelector(".play-again");
function makeMatrix () {
	for(let i =0; i<mrow*mcol; i++){
		let element = document.createElement("div");
		element.setAttribute("class","box");
		mineContainer.appendChild(element);
	}
	blast();
	adjectCell();
}


function heightWidthSet (cName,val){
	mineContainer.style= `grid-template-rows: repeat(${mcol},${val}px)`;
		mineContainer.style = `grid-template-columns: repeat(${mcol},${val}px)`;
	for(mine of mines){
		mine.classList.add(cName);
	}
}

function adjectCell () {
	if(mcol === 6){
		heightWidthSet("easy",50);
	}else if(mcol === 8){
		heightWidthSet("medium",45);
	}else if(mcol === 10){
			heightWidthSet("hard",40);
	}
}	



function updateMatrix () {
	mineContainer.innerHTML = "";
	makeMatrix();
	blast();
	matrix=[];
	create2dArray();
	fillBombs();
}


mode.addEventListener("click",(e)=>{
	// console.log(e.target.value);
	if(e.target.value === 'easy'){
		mrow = 6;
		mcol = 6;
	}else if (e.target.value === 'medium') {
		mrow = 8;
		mcol = 8;
	}else if (e.target.value === 'hard') {
		mrow = 10;
		mcol = 10;
	}
	updateMatrix();
})




//Creation of 2d array
function create2dArray() {
	for(let i=0; i<mrow; i++){
		let row = [];
		for(let j=0; j<mcol; j++){
			row.push(0);
		}
		matrix.push(row);
	}
}

//Random function
function random(mini,maxi) {
	return Math.floor(Math.random() * (maxi- mini + 1)) + mini;
}

//Fill Bombs
function fillBombs() {
	let mineCount = Math.floor(mines.length / 4);

	for(let i=0; i<mineCount; i++){
		let row = random(0,mrow-1);
		let col = random(0,mcol-1);

		matrix[row][col] = -1;
	}
}


//Print to check
function print() {
	console.log("Array elemtn");
	let cnt =0;
	for(let i=0; i<mrow; i++){
		console.log(`row ${i}`);
		for(let j=0;j <mcol; j++){
			console.log(matrix[i][j]);
			cnt++;
		}
		console.log('\n');
	}
	console.log(cnt);
}

function blast () {
	mines = document.querySelectorAll('.box');
	mines.forEach( (element, index) =>{
		element.addEventListener("click",()=>{
			// console.log(element)
			let row = Math.floor(index / mrow)
			let col = index % mcol;
			
			solve(row,col);
			print();
		});
	});
}


function blastBom (row,col) {
	let index ;
	for(let i=0; i<mrow; i++){
		for(let j=0; j<mcol; j++){
			if(matrix[i][j] == -1){
				index = i*mrow + j;
				mines[index].innerHTML = '<img src="./images/bomb.png" alt="bomb-img">';
				mines[index].classList.add("adj-img");
			}
		}
	}
}
//Count all mines in the matrix
function unreavelMines () {
	let Mcnt = 0;
	for(let i=0; i<mrow; i++){
		for(let j=0; j<mcol; j++){
			if(matrix[i][j] === 0){
				Mcnt++;
			}
		}
	}
	return Mcnt;
}


function solve (row,col) {
	let index = col + mrow*row;
	if(matrix[row][col] == -1){
		blastBom(row,col);
		console.log("End the game you lose");
		setTimeout(()=>{
			loose.parentElement.style= 'display:flex';
		},1000);
		return ;
	}
	if(unreavelMines() === 0){
		blastBom(row,col);
		setTimeout(()=>{
			win.parentElement.style= 'display:flex';
		},2000);
	}


	if(matrix[row][col] === 0){
		let count = isSafe(row,col);

		if(count == 0){
			console.log("empty place");
			mines[index].classList.add("empty");
			matrix[row][col] = 99;

			for(let drow=-1; drow<=1; drow++){
				for(let dcol=-1; dcol<=1; dcol++){
					nrow = row + drow;
					ncol = col + dcol;
					if(nrow<mrow && nrow>=0 && ncol<mcol && ncol>=0 && matrix[nrow][ncol] == 0){
						solve(nrow,ncol);
					}
				}
			}
		}else{
			matrix[row][col] = count;
			if(count === 1){
				mines[index].classList.add("green");
			}else if(count === 2){
				mines[index].classList.add("blue");
			}else{
				mines[index].classList.add("red");
			}
			mines[index].classList.add("bomb");
			mines[index].textContent = count;	
		}
	}
}

function isSafe (row,col) {
	let cnt = 0;
	for(let drow=-1; drow<=1; drow++){
		for(let dcol=-1; dcol<=1; dcol++){
			nrow = row + drow;
			ncol = col + dcol;

			if(nrow<mrow && nrow>=0 && ncol<mcol && ncol>=0 && matrix[nrow][ncol] == -1){
				cnt++;
			}
		}
	}
	return cnt;
}

//Loose Window
loose.addEventListener(("click"),()=>{
	loose.parentElement.style = "display:none"
	updateMatrix();
})
//Win window
win.addEventListener(("click"),()=>{
	win.parentElement.style = "display:none"
	updateMatrix();
})