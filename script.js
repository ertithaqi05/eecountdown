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
  saveLetterBtn.addEventListener("click", () => {
    const from = document.getElementById("letterFrom").value.trim();
    const text = document.getElementById("letterText").value.trim();

    if (!from || !text) {
      alert("Please write your name and your letter first.");
      return;
    }

    const letters = JSON.parse(localStorage.getItem("loveLetters")) || [];

    letters.push({
      from,
      text,
      date: new Date().toLocaleString()
    });

    localStorage.setItem("loveLetters", JSON.stringify(letters));

    window.location.href = "letters.html";
  });
}