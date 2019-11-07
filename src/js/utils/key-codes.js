const KeyCodes = Object.freeze({
  ARROW_DOWN: 40,
  ARROW_UP:   38,
  ENTER:      13,
  ESCAPE:     27
});

function parseKeyCode(event) {
  // See: https://stackoverflow.com/q/4285627/2490003
  return typeof event.which == 'number' ? event.which : event.keyCode;
}

export {
  KeyCodes,
  parseKeyCode
};
