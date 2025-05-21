const cardData = [
    { pair: 1, content: "<h1>" },
    { pair: 1, content: "HTML Heading" },

    { pair: 2, content: "<p>" },
    { pair: 2, content: "HTML Paragraph" },

    { pair: 3, content: "color: red;" },
    { pair: 3, content: "CSS Color Property" },

    { pair: 4, content: "font-size: 16px;" },
    { pair: 4, content: "CSS Font Size Property" },

    { pair: 5, content: "border: 1px solid black;" },
    { pair: 5, content: "CSS Border Property" },

    { pair: 6, content: "<div>" },
    { pair: 6, content: "HTML Div Element" },

    { pair: 7, content: "class='container'" },
    { pair: 7, content: "HTML Class Attribute" },

    { pair: 8, content: "background-color: blue;" },
    { pair: 8, content: "CSS Background Color" },

    { pair: 9, content: "<img src='image.jpg' />" },
    { pair: 9, content: "HTML Image Tag" },

    { pair: 10, content: "display: block;" },
    { pair: 10, content: "CSS Display Property" }
];

let gameBoard = document.getElementById("gameBoard");
let flippedCards = [];
let matchedPairs = 0;

let moves = 0;
let timer;
let seconds = 0;
let timerStarted = false;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function createCards() {
    shuffle(cardData).forEach((item, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.pair = item.pair;
        card.dataset.index = index;
        card.textContent = "❓";
        card.addEventListener("click", () => flipCard(card, item.content));
        gameBoard.appendChild(card);
    });
}

function startTimer() {
    timer = setInterval(() => {
        seconds++;
        document.getElementById("timer").textContent = `⏱ Time: ${seconds}s`;
    }, 1000);
}

function flipCard(card, content) {
    if (card.classList.contains("matched") || flippedCards.includes(card)) return;

    // Start timer on first flip
    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }

    card.textContent = content;
    card.classList.add("flipped");
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        document.getElementById("moves").textContent = `🧮 Moves: ${moves}`;

        const [card1, card2] = flippedCards;
        if (card1.dataset.pair === card2.dataset.pair && card1 !== card2) {
            card1.classList.add("matched");
            card2.classList.add("matched");
            matchedPairs++;
            if (matchedPairs === cardData.length / 2) {
                clearInterval(timer);
                setTimeout(() => alert(`🎉 You matched all pairs in ${moves} moves and ${seconds} seconds!`), 300);
            }
        } else {
            setTimeout(() => {
                card1.textContent = "❓";
                card2.textContent = "❓";
                card1.classList.remove("flipped");
                card2.classList.remove("flipped");
            }, 800);
        }
        flippedCards = [];
    }
}

createCards();
