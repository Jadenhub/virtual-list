export function throttle(fn, wait = 0.5) {
  let timer;
  let first = true;
  let result;
  return function() {
    const self = this;
    const args = arguments;
    if (timer) return;
    if (first) {
      result = fn.apply(self, args);
      first = false;
      return;
    }
    timer = setTimeout(() => {
      timer = null;
      result = fn.apply(self, args);
    }, wait);

    return result;
  };
}
