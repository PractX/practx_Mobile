function getMinutesFromSeconds(time, showZeroMin, showZeroSec) {
  const minutes = time >= 60 ? Math.floor(time / 60) : 0;
  const seconds = Math.floor(time - minutes * 60);

  return `${minutes >= 10 ? minutes : showZeroMin ? '0' + minutes : minutes}:${
    seconds >= 10 ? seconds : '0' + seconds
  }`;
}

export default getMinutesFromSeconds;
