export default (str: string) => {
  const sentence = str.split('_')
  return sentence.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}
