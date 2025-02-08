
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const refs = {
  datetimePicker: document.getElementById("datetime-picker"),
  startButton: document.querySelector("button[data-start]"),
  daysSpan: document.querySelector("[data-days]"),
  hoursSpan: document.querySelector("[data-hours]"),
  minutesSpan: document.querySelector("[data-minutes]"),
  secondsSpan: document.querySelector("[data-seconds]"),
};

let userSelectedDate = null;
let countdownInterval = null;

// Деактивуємо кнопку старту на початку
refs.startButton.disabled = true;

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimerDisplay({ days, hours, minutes, seconds }) {
  refs.daysSpan.textContent = addLeadingZero(days);
  refs.hoursSpan.textContent = addLeadingZero(hours);
  refs.minutesSpan.textContent = addLeadingZero(minutes);
  refs.secondsSpan.textContent = addLeadingZero(seconds);
}

function startCountdown() {
  countdownInterval = setInterval(() => {
    const currentTime = Date.now();
    const timeDifference = userSelectedDate - currentTime;

    if (timeDifference <= 0) {
      clearInterval(countdownInterval);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      refs.datetimePicker.disabled = false;

      iziToast.show({
        title: "Time is up!",
        message: "The countdown is complete.",
        color: "green",
        position: "topRight",
      });

      return;
    }

    updateTimerDisplay(convertMs(timeDifference));
  }, 1000);
}

flatpickr(refs.datetimePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
      iziToast.show({
        title: "Error",
        message: "Please choose a date in the future.",
        color: "red",
        position: "topRight",
      });
      refs.startButton.disabled = true;
    } else {
      userSelectedDate = selectedDate.getTime();
      refs.startButton.disabled = false;
    }
  },
});

refs.startButton.addEventListener("click", () => {
  refs.startButton.disabled = true;
  refs.datetimePicker.disabled = true;
  startCountdown();
});


console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}