
const submit=document.querySelector('button')
const result=document.querySelector('.result')

submit.addEventListener('click',()=>{
const word=document.getElementById('input').value
console.log(word)

    search_word(word)

})
input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') { 
        const word = input.value;
        console.log(word);
        await search_word(word);
    }
});
const search_word=async(word)=>{
    const response=await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    const data=await response.json()
    console.log(data)
  
    if (data.title === "No Definitions Found") {
        result.innerHTML = `<h2>Word Not Found</h2>`;
        return; 
    }
    result.innerHTML=`<h2>${data[0].word}</h2>`
    for(let i=0 ;i<data[0].meanings.length;i++){
    
    result.innerHTML+=`
    <br>
    <i style="color:#2B2B2B;">${data[0].meanings[i].partOfSpeech}</i>
   
    <p>${data[0].meanings[i].definitions[0].definition}</p>
    <p style="color:#2B2B2B;">${data[0].meanings[i].definitions[0].example===undefined?'':`"${data[0].meanings[i].definitions[0].example}"`}</p>
    
    ` 
   
}

result.innerHTML+=`
<br>
<a href=${data[0].sourceUrls}>Click here to read more</a>
`   
}
    


