const path = (window.location.pathname).split('/').filter(Boolean);
const bookName = path[1];

//console.log(window.location.pathname)
//console.log(bookName)

const options = {
    method: 'POST',
    header: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookName: bookName })
};

fetch(`/load-book`, options)
    .then(res => res.json())
    .then(data => {        
        // console.log(data);
        const bookName = data['bookName'];
        let chapterNum = 1;


        const title = document.getElementById('book-title');
        title.innerText = `${bookName}`;

        let verses = data['verses'].filter(verse => verse.chapter === chapterNum);
        loadChapter();

        const prevBtn = document.getElementById('prev');
        const nextBtn = document.getElementById('next');

        prevBtn.onclick = () => {
            chapterNum--;
            verses = data['verses'].filter(verse => verse.chapter === chapterNum);

            if (verses.length === 0) {
                chapterNum++;
            }
            else {
                loadChapter();
            }
        };

        nextBtn.onclick = () => {
            chapterNum++;
            verses = data['verses'].filter(verse => verse.chapter === chapterNum);

            if (verses.length === 0) {
                chapterNum--;
            }
            else {
                loadChapter();
            }        
        };

        function loadChapter() {
            const headerCont = document.getElementById('header');
            headerCont.innerHTML = '';
            headerCont.innerHTML = `<h1>${bookName}</h1>
                                    <h3>Chapter ${chapterNum}</h3>`;

            const versesCont = document.getElementById('verses');
            versesCont.innerHTML = '';

            let verseElmnt = null;
            for (verse of verses) {
                verseElmnt = document.createElement('div');
                verseElmnt.classList.add('verse');
                verseElmnt.innerHTML = `<span>${verse['verse']}</span>
                                        <p>${verse['text']}</p>`;
    
                versesCont.appendChild(verseElmnt);
            }
        }
        
});
