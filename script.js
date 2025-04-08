const submit=document.getElementById('submit-btn')
const result=document.querySelector('.result')
const input=document.getElementById('input')
const speech_btn=document.getElementById('voice-btn')
const bookmark_btn=document.getElementById('bookmark-btn')
const clear_list=document.getElementById('clear-list')
const bookmark_list=document.querySelector('ul')
submit.addEventListener('click',()=>{
const word=document.getElementById('input').value

    search_word(word)

})
input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') { 
        const word = input.value;
        await search_word(word);
    }
});
speech_btn.addEventListener('click',()=>{
    if(!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)){
        result.innerHTML=`<h3 style="color:red;">Speech Recognition is NOT supported in this browser.</h3>`
        
    }

    const recognition=new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    recognition.lang='en-US'
    recognition.continuous=false
    recognition.interimResults=false
    recognition.start()
    recognition.onerror = function (event) {
        console.error("Speech recognition error:", event.error);
        result.innerHTML = `<h3 style="color:red;">Speech recognition error: ${event.error}</h3>`;
    };
    recognition.onresult=function (event) {
        const spokenText = event.results[0][0].transcript;
        input.value=spokenText
        search_word(spokenText)
    };
})
const search_word=async(word)=>{
    try{
    result.innerHTML=`<h2>Searching ...</h2>`
    const response=await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    if(!response.ok) throw new Error ("Word not found")
    const data=await response.json()
    console.log(data)
  
    if (data.title === "No Definitions Found") {
        result.innerHTML = `<h3>Word Not Found</h3>`;
        return; 
    }
    result.innerHTML = `
    <h2 style="display:inline;margin-right:20px;">${data[0].word}</h2> 
    <i class="fas fa-bookmark bookmark-icon" id="bookmark-word"></i>
     `;
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
const bookmark_word = document.getElementById('bookmark-word');
bookmark_word.addEventListener('click', () => {
    if(bookmark_word.classList.contains('bookmarked')){
        bookmark_word.classList.remove('bookmarked')
        bookmark_word.style.color=''
        remove_bookmark(data[0].word)
    }
    else{
        bookmark_word.classList.add('bookmarked')
        bookmark_word.style.color = '#28a745';
        create_bookmark(data[0].word);
    }
    console.log("bookmark_clicked");
    
});

    }
    catch(error){
        result.innerHTML=`<h3 style="color:red;">${error.message}</h3>`
    }

}
  
bookmark_btn.addEventListener('click',()=>{
    document.getElementById('bookmark-panel').classList.toggle('active')

})
clear_list.addEventListener('click',()=>{
    document.getElementById('bookmark-panel').classList.remove('active')

})

const create_bookmark=(word)=>{
    let li=document.createElement('li')
    li.className='bookmark-word'
    li.textContent=word
    let delete_icon=document.createElement('i')
    delete_icon.className='fas fa-trash delete-btn'
    li.appendChild(delete_icon)
    bookmark_list.appendChild(li)
    delete_icon.addEventListener('click', () => {
        li.remove();  
        const bookmark_word_icon = document.getElementById('bookmark-word');
        if (bookmark_word_icon && bookmark_word_icon.classList.contains('bookmarked')) {
        const currentWord = document.querySelector('.result h2')?.textContent.trim();
        if (currentWord === word) {
            bookmark_word_icon.classList.remove('bookmarked');
            bookmark_word_icon.style.color = '';
        }
    }
    });
    console.log(li)
    console.log(bookmark_list)


}
const remove_bookmark=(word)=>{
    let bookmarks=document.querySelectorAll('.bookmark-word')
    bookmarks.forEach((bookmark) => {
        if (bookmark.textContent.trim() === word) {
            bookmark.remove(); 
        }
    });
}
