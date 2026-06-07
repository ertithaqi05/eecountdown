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

const dateIdeas = [
  "Movie 🍿",
  "Picnic in the park 🧺",
  "Late night walk 🌙",
  "Coffee date ☕",
  "Ice cream date 🍦",
  "Pasta???? (i already know its this one) 🍝",
  "Mini golf date ⛳",
  "Arcade date 🧸",
  "Sunset walk 🌅",
  "Build a Lego set together 🧱",
  "Board game night 🎲",
  "Cake date 🍰"
];

const pickDateBtn = document.getElementById("pickDateBtn");
const dateIdea = document.getElementById("dateIdea");

if (pickDateBtn) {
  pickDateBtn.addEventListener("click", () => {
    const randomIdea = dateIdeas[Math.floor(Math.random() * dateIdeas.length)];
    dateIdea.textContent = randomIdea;
  });
}