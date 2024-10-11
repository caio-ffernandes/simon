let sequence = [];
let playerSequence = [];
let score = 0;
let allowInput = false;
let currentPlayer = null;

const startButton = document.getElementById('start-game');
const scoreDisplay = document.getElementById('score');
const colorBoxes = document.querySelectorAll('.color-box');
const registerBtn = document.getElementById('register-btn');
const usernameInput = document.getElementById('username');
const gameSection = document.getElementById('game-section');
const rankingList = document.getElementById('ranking-list');

// Carregar ranking do localStorage
function loadRanking() {
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    rankingList.innerHTML = '';
    ranking.forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.username} - ${player.score} pontos`;
        rankingList.appendChild(li);
    });
}

// Função para salvar jogador no ranking
function saveScore(username, score) {
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    const playerIndex = ranking.findIndex(player => player.username === username);

    if (playerIndex >= 0) {
        if (score > ranking[playerIndex].score) {
            ranking[playerIndex].score = score;
        }
    } else {
        ranking.push({ username, score });
    }

    ranking.sort((a, b) => b.score - a.score);
    localStorage.setItem('ranking', JSON.stringify(ranking));
    loadRanking();
}

// Função de cadastro
registerBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        currentPlayer = username;
        usernameInput.value = '';
        gameSection.style.display = 'block';
        document.getElementById('register-form').style.display = 'none';
    } else {
        alert('Digite um nome de usuário!');
    }
});

// Função para iniciar o jogo
startButton.addEventListener('click', startGame);

function startGame() {
    sequence = [];
    playerSequence = [];
    score = 0;
    scoreDisplay.textContent = `Pontuação: ${score}`;
    nextRound();
}

// Função para adicionar uma cor aleatória à sequência e exibir para o jogador
function nextRound() {
    const colors = ['green', 'red', 'yellow', 'blue'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    sequence.push(randomColor);
    allowInput = false;
    playerSequence = [];
    displaySequence();
}

// Exibe a sequência ao jogador
function displaySequence() {
    sequence.forEach((color, index) => {
        setTimeout(() => {
            playColor(color);
        }, (index + 1) * 800);
    });

    setTimeout(() => {
        allowInput = true;  // Permite o input do jogador após a sequência ser exibida
    }, sequence.length * 800);
}

// Função para animar a cor correspondente
function playColor(color) {
    const element = document.getElementById(color);
    element.classList.add('active');
    setTimeout(() => {
        element.classList.remove('active');
    }, 400);
}

// Adiciona eventos de clique às cores
colorBoxes.forEach(box => {
    box.addEventListener('click', (e) => {
        if (!allowInput) return;  // Bloqueia input durante a exibição da sequência

        const color = e.target.id;
        playerSequence.push(color);
        playColor(color);
        checkSequence();
    });
});

// Verifica se a sequência clicada pelo jogador está correta
function checkSequence() {
    const lastIndex = playerSequence.length - 1;
    if (playerSequence[lastIndex] !== sequence[lastIndex]) {
        alert('Erro! Fim do jogo.');
        saveScore(currentPlayer, score);  // Salva a pontuação no ranking
        gameSection.style.display = 'none'; // Oculta o jogo para reiniciar
        document.getElementById('register-form').style.display = 'block';
        return;
    }

    if (playerSequence.length === sequence.length) {
        score++;
        scoreDisplay.textContent = `Pontuação: ${score}`;
        setTimeout(nextRound, 1000);
    }
}

// Carregar o ranking ao iniciar
loadRanking();
