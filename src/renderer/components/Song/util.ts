function padLeft(num: number): string {
  return (new Array(3).join('0') + num).slice(-2);
}

export function parseTime(time: number): string {
  const hours = Math.floor(time / (60 * 60));
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  let formattedTime = `${padLeft(minutes)}:${padLeft(seconds)}`;

  if (hours > 0) {
    formattedTime = `${padLeft(hours)}:${formattedTime}`;
  }

  return formattedTime;
}
