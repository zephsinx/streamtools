let cardOrder;
let currentCard;
const card = document.getElementById('card');
const cards = document.querySelectorAll('.shuffle-card');
const cardLabel = document.querySelector('label[for="card"]');
const drawButton = document.getElementById('drawButton');

// Set array of card indexes in draw order
shuffle();

function shuffle() {
    cards.forEach((card) => card.classList.add('shuffle'));
    setTimeout(() => {
        cards.forEach((card) => card.classList.remove('shuffle'));
    }, 1000);

    currentCard = 0;
    let cardCount = TarotDeck.length;
    if (isNaN(cardCount) || cardCount < 1) {
        return [];
    }

    let arr = [];
    for (let i = 0; i < cardCount; i++) {
        arr.push(i);
    }

    // Fisher-Yates shuffle algorithm to randomize the contents of the array
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    cardOrder = arr;
}

function getNextCard() {
    if (currentCard > TarotDeck.length) {
        shuffle();
    }
    let nextCard = cardOrder[currentCard];
    currentCard++;
    return TarotDeck[nextCard];
}

function toggleCardOpacity() {
    if (card.style.opacity === '1') {
        card.style.opacity = '0';
        cardLabel.style.opacity = '0';
        setTimeout(function () {
            drawButton.disabled = false;
        }, 1000);
    } else {
        drawButton.disabled = true;
        card.style.opacity = '1';
        cardLabel.style.opacity = '1';
    }
}

function drawCard() {
    let nextCard = getNextCard();
    card.style.maxHeight = '90%';
    card.alt = nextCard.name;
    card.src = nextCard.img;
    cardLabel.innerHTML = nextCard.name;
    toggleCardOpacity();
    setTimeout(function () {
        toggleCardOpacity();
    }, 5000);
}