export default function (url: string) {
  return /^(?:[a-z][a-z0-9\-.+]*:)?\/\//i.test(url);
}
