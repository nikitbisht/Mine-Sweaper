let mineContainer = document.querySelector(".mine-container");
let mines = document.querySelectorAll('.box');
const mode = document.querySelector('#modes');

const flag = document.querySelector("#mine-count");
const again = document.querySelector("#again");

let loose = document.querySelector(".try-again");
let win = document.querySelector(".play-again");


let matrix = [];
let visited = [];
let mrow = 6;
let mcol = 6;
let flagCount = 6;


updateMatrix();
adjectCell();
ModeChanging();

//count no of bomb in matrix
function countBomb () {
	let cnt = 0;
	for(let i=0; i<mcol ;i++){
		for(let j=0; j<mrow; j++){
			if(matrix[i][j] == -1)
				cnt++;
		}
	}
	return cnt;
}

//Create a new Grid
function makeMatrix () {
	for(let i =0; i<mrow*mcol; i++){
		let element = document.createElement("div");
		element.setAttribute("class","box");
		mineContainer.appendChild(element);
	}
	mineClick();
	adjectCell();
}


function heightWidthSet (cName,val){
	mineContainer.style= `grid-template-rows: repeat(${mcol},${val}px)`;
		mineContainer.style = `grid-template-columns: repeat(${mcol},${val}px)`;
	for(mine of mines){
		mine.classList.add(cName);
	}
}
//Adjust grid cell height and width
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
	matrix=[];
	visited =[];
	create2dArray();
	fillBombs();
	SetFlag();
	flagCount = countBomb();
	flag.innerText = `${flagCount}`;
}


function ModeChanging () {	
	let preValue = 'easy';
	mode.addEventListener("click",(e)=>{
		if(mode.value==='easy' && mode.value != preValue){
			mrow = 6;
			mcol = 6;
			updateMatrix();
		}else if (mode.value==='medium' && mode.value != preValue) {
			mrow = 8;
			mcol = 8;
			updateMatrix();
		}else if (mode.value==='hard' && mode.value != preValue) {
			mrow = 10;
			mcol = 10;
			updateMatrix();
		}
		
		handleWindow();
		preValue = mode.value;
	});
}


//Creation of 2d array
function create2dArray() {
	for(let i=0; i<mrow; i++){
		let row = [];
		let nrow = [];
		for(let j=0; j<mcol; j++){
			row.push(0);
			nrow.push(0);
		}
		matrix.push(row);
		visited.push(nrow);
	}
}


//Random function
function random(mini,maxi) {
	return Math.floor(Math.random() * (maxi- mini + 1)) + mini;
}


//Fill Bombs in a grid
function fillBombs() {
	let mineCount = Math.floor(mines.length / 4);

	for(let i=0; i<mineCount; i++){
		let row = random(0,mrow-1);
		let col = random(0,mcol-1);

		matrix[row][col] = -1;
	}
}

//Check to revel mine
function mineClick () {
	mines = document.querySelectorAll('.box');
	mines.forEach( (element, index) =>{
		element.addEventListener("click",(e)=>{
			let row = Math.floor(index / mrow)
			let col = index % mcol;
			if(visited[row][col] != 1){
				solve(row,col);
			};
		});
	});
}


//Set the flag in gird
function SetFlag () {
	mines.forEach((element, index) =>{
		element.addEventListener("contextmenu",(e)=>{
			e.preventDefault();
			let row = Math.floor(index / mrow)
			let col = index % mcol;
			if(visited[row][col] === 0 && flagCount>0){
				flagCount --;
				let newElement = document.createElement("img");
				newElement.src="./images/flag.png";
				newElement.setAttribute("class","flag-image");
				visited[row][col] = 1;
				element.appendChild(newElement);
			}else if(visited[row][col] === 1){
				flagCount++;
				element.removeChild(element.firstChild);
				visited[row][col] = 0;
			}
			flag.innerText = `${flagCount}`;
		});
	});
}

//Loose and blast All bomb
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

//Count all Unrevel & dont have bomb mines
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

//Use DFS to traverse
function solve (row,col) {
	let index = col + mrow*row;
	//Bomb
	if(matrix[row][col] == -1){
		blastBom(row,col);
		setTimeout(()=>{
			loose.parentElement.style= 'display:flex';
		},1000);
		return ;
	}


	if(matrix[row][col] === 0 && visited[row][col] === 0){
		let count = countNearBomb(row,col);

		if(count == 0){
			mines[index].classList.add("empty");
			matrix[row][col] = 99;
			visited[row][col] = -1;

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
			visited[row][col] = 2;
			if(count === 1){
				mines[index].classList.add("green");
			}else if(count === 2){
				mines[index].classList.add("blue");
			}else{
				mines[index].classList.add("red");
			}
			mines[index].classList.add("safe-place");
			mines[index].textContent = count;	
		}
	}

	if(unreavelMines() == 0){
		blastBom(row,col);
		setTimeout(()=>{
			win.parentElement.style= 'display:flex';
		},2000);
	}

}

function countNearBomb(row,col) {
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
	handleWindow();
})


//Win window
win.addEventListener(("click"),()=>{
	win.parentElement.style = "display:none"
	updateMatrix();
	handleWindow();
})



//AGAIN
again.addEventListener("click",(e)=>{
	updateMatrix();
	handleWindow();
});


//Remove Class to make grid smaller
function removeClass(rclass) {
	for(mine of mines){
		mine.classList.remove(rclass);
	}
}


//RESPONSIVE DESIGN
const mediaQuery = window.matchMedia('(max-width:420px)');
function handleWindow () {
	if(mediaQuery.matches){
		if(mcol === 6){
			removeClass('easy');
			heightWidthSet("Weasy",40)
		}else if(mcol === 8){
			removeClass('medium');
			heightWidthSet("Wmedium",30);
		}else if(mcol === 10){
			removeClass('hard');
			heightWidthSet("Whard",25);
		}
	}else{
		removeClass('Wmedium');
		removeClass('Whard');
		removeClass('Weasy');
		adjectCell();
	}
}

mediaQuery.addListener(handleWindow);


handleWindow();
