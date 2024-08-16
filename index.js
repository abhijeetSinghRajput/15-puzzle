const pieces = [...document.querySelectorAll('.piece')];
const bestScore = document.querySelector('#best-score value');
const scoreCount = document.querySelector('#score-count value');
const btns = [...document.querySelectorAll('button')];

const gameEndSound = new Audio('./game-end.mp3');
const moveSound = new Audio('./move.mp3');

btns.forEach(btn=>{
    btn.addEventListener('click', ({target})=>{
        let isLegal = null;
        switch(target.id){
            case 'up': isLegal = move(DOWN); break;
            case 'right': isLegal = move(LEFT); break;
            case 'down': isLegal = move(UP); break;
            case 'left': isLegal = move(RIGHT); break;
            default: break;
        }
        if (isLegal) {
            moveSound.play();
            scoreCount.textContent = Number(scoreCount.textContent) + 1;
        }
        if (isWin()) {
            const score = scoreCount.textContent;
            if(Number(score) < best){
                best = score;
                localStorage.setItem('bestScore', score);
            }
            newGame();
        }
    })
})

let best = Infinity;
// ==========================================
// ============= INITIALIZATION =============
// ==========================================
let emptyCordinate;
const matrix = [];
const directions = [
    { x: -1, y: 0 },//up
    { x: 1, y: 0 },//down
    { x: 0, y: -1 },//left
    { x: 0, y: 1 },//right
];
const [UP, DOWN, LEFT, RIGHT] = directions;

for (let i = 0; i < 4; ++i) {
    const row = [];
    for (let j = 0; j < 4; ++j) {
        let piece = pieces[i * 4 + j];
        if (piece.classList.contains('empty')) {
            emptyCordinate = { x: i, y: j };
        }
        row.push(piece);
    }
    matrix.push(row);
}


// ==========================================
// =============== GAME LOGIC ===============
// ==========================================
function newGame() {
    gameEndSound.play();
    scoreCount.textContent = 0;
    best = Number(localStorage.getItem('bestScore')) || Infinity;
    bestScore.textContent = (best == Infinity)? 0 : best;
    suffle();
}
newGame();


window.addEventListener('keydown', ({ key }) => {
    let isLegal = null;
    switch (key) {
        case "ArrowUp": isLegal = move(DOWN); break;
        case "ArrowDown": isLegal = move(UP); break;
        case "ArrowLeft": isLegal = move(RIGHT); break;
        case "ArrowRight": isLegal = move(LEFT); break;
        default: break;
    }
    if (isLegal) {
        moveSound.play();
        scoreCount.textContent = Number(scoreCount.textContent) + 1;
    }
    if (isWin()) {
        const score = scoreCount.textContent;
        if(Number(score) < best){
            best = score;
            localStorage.setItem('bestScore', score);
        }
        newGame();
    }
})


function isValidCordinate(x, y) {
    return x >= 0 && y >= 0 && x < 4 && y < 4
}

function suffle(count = 500) {
    for (let i = 0; i < count;) {
        const randomIndex = Math.floor(Math.random() * directions.length);
        if (move(directions[randomIndex])) {
            ++i;
        }
    }
    //corner the empty cell
    while (move(DOWN));
    while (move(RIGHT));
}

function isWin() {
    for (let i = 0; i < 15; ++i) {
        if (pieces[i].textContent != i + 1) {
            return false;
        }
    }
    return true;
}

function move(direction) {
    if (!isValidCordinate(emptyCordinate.x + direction.x, emptyCordinate.y + direction.y)) {
        return false;
    }

    const emptyPiece = matrix[emptyCordinate.x][emptyCordinate.y];
    const adjPiece = matrix[emptyCordinate.x + direction.x][emptyCordinate.y + direction.y];

    // change the empty piece
    emptyCordinate.x += direction.x;
    emptyCordinate.y += direction.y;

    emptyPiece.textContent = adjPiece.textContent;
    emptyPiece.classList.remove('empty');

    adjPiece.classList.add('empty');
    adjPiece.textContent = '';
    return true;
}