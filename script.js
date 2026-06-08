const SUPABASE_URL = "https://dyhuylpyjsevmsxfjqyb.supabase.co";
const SUPABASE_KEY = "sb_publishable_kILXOA3VZ2x-woWhnHZx2Q_iI-0oDKV";

const targetDate = new Date("2027-01-31T00:00:00").getTime();

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function updateCountdown() {
  const now = new Date().getTime();
  const gap = targetDate - now;

  if (gap <= 0) {
    daysEl.textContent = "000";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    return;
  }

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(gap / day);
  const hours = Math.floor((gap % day) / hour);
  const minutes = Math.floor((gap % hour) / minute);
  const seconds = Math.floor((gap % minute) / second);

  daysEl.textContent = String(days).padStart(3, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

const saveLetterBtn = document.getElementById("saveLetterBtn");

if (saveLetterBtn) {
  saveLetterBtn.addEventListener("click", async () => {
    const sender = document.getElementById("letterFrom").value.trim();
    const message = document.getElementById("letterText").value.trim();

    if (!sender || !message) {
      alert("Please write your name and your letter first.");
      return;
    }

    const response = await fetch(`${SUPABASE_URL}/rest/v1/love_letters`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sender: sender,
        message: message
      })
    });

    if (!response.ok) {
      alert("Something went wrong saving the letter.");
      return;
    }

    window.location.href = "letters.html";
  });
}

const pickDateBtn = document.getElementById("pickDateBtn");
const dateIdea = document.getElementById("dateIdea");
const dateSelect = document.getElementById("dateSelect");

async function loadPickedDate() {
  if (!dateIdea) return;

  const response = await fetch(`${SUPABASE_URL}/rest/v1/date_pick?id=eq.1&select=*`, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`
    }
  });

  const data = await response.json();

  if (data.length > 0) {
    dateIdea.textContent = data[0].idea;

    if (dateSelect) {
      dateSelect.value = data[0].idea;
    }
  }
}

async function savePickedDate(idea) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/date_pick`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "resolution=merge-duplicates"
    },
    body: JSON.stringify({
      id: 1,
      idea: idea,
      updated_at: new Date().toISOString()
    })
  });

  if (!response.ok) {
    alert("Something went wrong saving the date idea.");
  }
}

if (pickDateBtn) {
  loadPickedDate();

  pickDateBtn.addEventListener("click", async () => {
    const selectedIdea = dateSelect.value;

    if (!selectedIdea) {
      alert("Please choose a date idea first.");
      return;
    }

    dateIdea.textContent = selectedIdea;
    await savePickedDate(selectedIdea);
  });
}

const reasons = [
  "I love your smile",
  "I love how you make me laugh",
  "I love how you make me feel seen",
  "I love talking to you for hours",
  "I love your eyes... a lot",
  "I love how excited you get about me",
  "I love how safe I feel with you",
  "I love when you say my name",
  "I love how you always support me",
  "I love making memories with you",
  "I love your voice",
  "I love the way you look at me",
  "I love how perfect you are",
  "I love being able to be myself around you",
  "I love everything about you"
];

const reasonBtn = document.getElementById("reasonBtn");
const loveReason = document.getElementById("loveReason");

if (reasonBtn) {
  reasonBtn.addEventListener("click", () => {
    const randomReason =
      reasons[Math.floor(Math.random() * reasons.length)];

    loveReason.textContent = randomReason;
  });
}

const dailyQuestions = [
  "What is your favourite memory of us?",
  "What is one place you want us to go together?",
  "What is something that made you smile today?",
  "What food should we get together next?",
  "What song reminds you of us?",
  "What is one thing you love about me?",
  "What is your perfect date with me?",
  "What is something you are looking forward to with us?",
  "What is one thing you want to do together this year?",
  "What is your favourite thing about our relationship?"
];

const dailyQuestionEl = document.getElementById("dailyQuestion");
const dailyNameEl = document.getElementById("dailyName");
const dailyAnswerEl = document.getElementById("dailyAnswer");
const submitDailyBtn = document.getElementById("submitDailyBtn");
const dailyResults = document.getElementById("dailyResults");

function getTodayDateKey() {
  return new Date().toISOString().split("T")[0];
}

function getDailyQuestion() {
  const today = new Date();
  const start = new Date("2025-01-01");

  const dayNumber = Math.floor(
    (today - start) / (1000 * 60 * 60 * 24)
  );

  const index =
    ((dayNumber % dailyQuestions.length) + dailyQuestions.length) %
    dailyQuestions.length;

  return dailyQuestions[index];
}

function normaliseAnswer(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ");
}

async function loadDailyAnswers() {
  if (!dailyResults) return;

  const todayKey = getTodayDateKey();

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/daily_answers?answer_date=eq.${todayKey}&select=*&order=created_at.asc`,
    {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  const answers = await response.json();

  if (answers.length >= 2) {
    showDailyResults(answers);
    hideDailyForm();
  } else {
    dailyResults.innerHTML = `
      <p class="match-text">
        ${answers.length}/2 answers submitted. Answers unlock when both people have answered ❤️
      </p>
    `;
    dailyResults.classList.remove("hidden");
  }
}

function showDailyResults(answers) {
  let matchText = "";

  if (answers.length >= 2) {
    const answerOne = normaliseAnswer(answers[0].answer);
    const answerTwo = normaliseAnswer(answers[1].answer);

    matchText =
      answerOne === answerTwo
        ? "<p class='match-text'>You matched! ❤️ You both said the same thing.</p>"
        : "<p class='match-text'>No exact match today, but both answers are cute ❤️</p>";
  }

  dailyResults.innerHTML = `
    <h3>Today’s Answers</h3>
    ${matchText}
    ${answers
      .map(
        item => `
          <div class="daily-answer-card">
            <strong>From: ${item.sender}</strong>
            <p>${item.answer}</p>
          </div>
        `
      )
      .join("")}
  `;

  dailyResults.classList.remove("hidden");
}

function hideDailyForm() {
  if (dailyNameEl) dailyNameEl.style.display = "none";
  if (dailyAnswerEl) dailyAnswerEl.style.display = "none";
  if (submitDailyBtn) submitDailyBtn.style.display = "none";
}

if (dailyQuestionEl) {
  dailyQuestionEl.textContent = getDailyQuestion();
  loadDailyAnswers();
}

if (submitDailyBtn) {
  submitDailyBtn.addEventListener("click", async () => {
    const sender = dailyNameEl.value.trim();
    const answer = dailyAnswerEl.value.trim();
    const todayKey = getTodayDateKey();

    if (!sender || !answer) {
      alert("Please write your name and answer first.");
      return;
    }

    const checkResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/daily_answers?answer_date=eq.${todayKey}&select=*`,
      {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const existingAnswers = await checkResponse.json();

    if (existingAnswers.length >= 2) {
      alert("Both answers have already been submitted for today.");
      showDailyResults(existingAnswers);
      hideDailyForm();
      return;
    }

    const response = await fetch(`${SUPABASE_URL}/rest/v1/daily_answers`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        answer_date: todayKey,
        sender: sender,
        answer: answer
      })
    });

    if (!response.ok) {
      alert("Something went wrong saving your answer.");
      return;
    }

    dailyNameEl.value = "";
    dailyAnswerEl.value = "";

    await loadDailyAnswers();
  });
}

const menuBtn = document.getElementById("menuBtn");
const closeMenu = document.getElementById("closeMenu");
const sideMenu = document.getElementById("sideMenu");

if (menuBtn && sideMenu) {
  menuBtn.addEventListener("click", () => {
    sideMenu.classList.add("open");
  });
}

if (closeMenu && sideMenu) {
  closeMenu.addEventListener("click", () => {
    sideMenu.classList.remove("open");
  });
}