export function dateMaker() {
  const date = new Date().toISOString();
  const dateTime = date.slice(0, 10).split("-").reverse().join("/");
  const dateHours = date.slice(11, 16);
  return `${dateTime}, ${dateHours}`;
}
