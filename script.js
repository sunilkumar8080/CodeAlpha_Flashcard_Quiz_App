const cardText = document.getElementById("cardText");
const cardNumber = document.getElementById("cardNumber");
const cardType = document.getElementById("cardType");
const showAnswerBtn = document.getElementById("showAnswerBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const addBtn = document.getElementById("addBtn");
const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");
const cardForm = document.getElementById("cardForm");
const formTitle = document.getElementById("formTitle");
const questionInput = document.getElementById("questionInput");
const answerInput = document.getElementById("answerInput");
const cancelBtn = document.getElementById("cancelBtn");

const starterCards = [
  { question: "What does HTML stand for?", answer: "HyperText Markup Language. It defines the structure of web pages." },
  { question: "What is CSS used for?", answer: "CSS styles web pages, including colors, layouts, spacing and typography." },
  { question: "What is JavaScript?", answer: "JavaScript adds behavior and interactivity to websites." }
];

let cards = loadCards();
let currentIndex = 0;
let showingAnswer = false;
let formMode = "add";

function loadCards() {
  try {
    const saved = localStorage.getItem("flashcards");
    return saved ? JSON.parse(saved) : starterCards;
  } catch {
    return starterCards;
  }
}

function saveCards() {
  localStorage.setItem("flashcards", JSON.stringify(cards));
}

function renderCard() {
  const hasCards = cards.length > 0;

  [showAnswerBtn, nextBtn, prevBtn, editBtn, deleteBtn].forEach(button => {
    button.disabled = !hasCards;
  });

  if (!hasCards) {
    cardText.textContent = "No flashcards yet. Add your first card!";
    cardNumber.textContent = "Card 0 of 0";
    cardType.textContent = "EMPTY";
    showAnswerBtn.textContent = "Show Answer";
    return;
  }

  const card = cards[currentIndex];
  cardText.textContent = showingAnswer ? card.answer : card.question;
  cardType.textContent = showingAnswer ? "ANSWER" : "QUESTION";
  cardNumber.textContent = `Card ${currentIndex + 1} of ${cards.length}`;
  showAnswerBtn.textContent = showingAnswer ? "Show Question" : "Show Answer";
}

showAnswerBtn.addEventListener("click", () => {
  showingAnswer = !showingAnswer;
  renderCard();
});

nextBtn.addEventListener("click", () => {
  if (!cards.length) return;
  currentIndex = (currentIndex + 1) % cards.length;
  showingAnswer = false;
  renderCard();
});

prevBtn.addEventListener("click", () => {
  if (!cards.length) return;
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  showingAnswer = false;
  renderCard();
});

function openForm(mode) {
  formMode = mode;
  formTitle.textContent = mode === "add" ? "Add Flashcard" : "Edit Flashcard";

  if (mode === "edit" && cards.length) {
    questionInput.value = cards[currentIndex].question;
    answerInput.value = cards[currentIndex].answer;
  } else {
    questionInput.value = "";
    answerInput.value = "";
  }

  cardForm.classList.remove("hidden");
  questionInput.focus();
}

addBtn.addEventListener("click", () => openForm("add"));
editBtn.addEventListener("click", () => {
  if (cards.length) openForm("edit");
});

cardForm.addEventListener("submit", event => {
  event.preventDefault();

  const question = questionInput.value.trim();
  const answer = answerInput.value.trim();
  if (!question || !answer) return;

  if (formMode === "add") {
    cards.push({ question, answer });
    currentIndex = cards.length - 1;
  } else if (cards.length) {
    cards[currentIndex] = { question, answer };
  }

  saveCards();
  showingAnswer = false;
  cardForm.reset();
  cardForm.classList.add("hidden");
  renderCard();
});

cancelBtn.addEventListener("click", () => {
  cardForm.reset();
  cardForm.classList.add("hidden");
});

deleteBtn.addEventListener("click", () => {
  if (!cards.length) return;

  if (!confirm("Delete this flashcard?")) return;

  cards.splice(currentIndex, 1);
  currentIndex = Math.min(currentIndex, cards.length - 1);
  showingAnswer = false;
  saveCards();
  renderCard();
});

renderCard();
