
const submit=document.getElementById('submit-btn')
const result=document.querySelector('.result')
const input=document.getElementById('input')
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
    try{
    result.innerHTML=`<h2>Searching ...</h2>`
    const response=await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    if(!response.ok) throw new Error ("Word not found")
    const data=await response.json()
    console.log(data)
  
    if (data.title === "No Definitions Found") {
        result.innerHTML = `<h2>Word Not Found</h2>`;
        return; 
    }
    result.innerHTML = `<h2>${data[0].word}</h2>`;
    const phonetics = data[0].phonetics.find(p => p.audio);
    if (phonetics && phonetics.audio) {
        result.innerHTML += `
            <p style="display: flex; align-items: center; gap: 5px;">
                Pronunciation: ${phonetics.text} 
                <button onclick="new Audio('${phonetics.audio}').play()" 
                    style="background: none; border: none; cursor: pointer; font-size: 18px; padding: 2px;">
                    🔊
                </button>
            </p>
        `;
    }

    for(let i=0 ;i<data[0].meanings.length;i++){
    
    result.innerHTML+=`
    <br>
    <i style="color:#2B2B2B;">${data[0].meanings[i].partOfSpeech}</i>
   
    <p>${data[0].meanings[i].definitions[0].definition}</p>
    ` 
    const example = data[0].meanings[i].definitions[0].example;
    if (example) {
        result.innerHTML += `<p style="color:#2B2B2B;">"${example}"</p>`;
    }
   
}

result.innerHTML+=`
<br>
<a href=${data[0].sourceUrls}>Click here to read more</a>
`  
    }
    catch(error){
        result.innerHTML=`<h2 style="color:red;">${error.message}</h2>`
    }

}
    


