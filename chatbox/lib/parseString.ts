export function parseString(str: string) {
  let sender = str.substring(0, 1)
  let message = str.substring(2)
  return [sender, message]
}