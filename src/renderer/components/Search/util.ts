/**
 * Converts an ISO 8601 duration into seconds
 * @param duration The duration, as an ISO 8601 formatted string.
 */
export function parseDuration(duration: string): number {
  let seconds = 0;

  let number = '';
  let onNumber = false;

  for (let i = 0; i < duration.length; i++) {
    const c = duration[i];

    // If the character is a number, parse piece of duration
    if (!isNaN(parseInt(c))) {
      number += c;
      onNumber = true;
    } else if (onNumber) {
      // If we moved off a number, parse that portion
      const num = parseInt(number);

      switch (c) {
        case 'H':
          seconds += num * 3600;
          break;
        case 'M':
          seconds += num * 60;
          break;
        case 'S':
          seconds += num;
          break;
      }

      number = '';
      onNumber = false;
    }
  }

  return seconds;
}
