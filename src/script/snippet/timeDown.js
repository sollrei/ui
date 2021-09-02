/**
 * 
 * @param {string} endDate 
 * @returns {object} time
 */
const timeDown = function (endDate) {
  if (!endDate) return null;

  let today = new Date();
  let stopTime = new Date(endDate);
  let distance = stopTime.getTime() - today.getTime();

  if (distance <= 0) {
    return null;
  }

  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  if (days < 10) {
    days = '0' + days;
  }

  if (hours < 10) {
    hours = '0' + hours;
  }

  if (minutes < 10) {
    minutes = '0' + minutes;
  }

  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  return {
    days,
    hours,
    minutes,
    seconds
  };
};

export default timeDown;
