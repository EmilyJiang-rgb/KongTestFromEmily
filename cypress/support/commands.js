Cypress.Commands.add('getTimestamp', () => {
  const now = new Date();
  const pad = (n, width = 2) => n.toString().padStart(width, '0');
  return (
    now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds()) +
    pad(now.getMilliseconds(), 3)
  );
});