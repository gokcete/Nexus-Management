export let prohibitedWords = [
    // please provide all the words you want to reject from comments:
  
    "word01",
    "word02",
    "word03"
  ];

 
  
  const regexPattern = new RegExp(prohibitedWords.join("|"), "i");
  
  export default regexPattern;