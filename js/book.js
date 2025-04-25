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
        console.log(data);

        const bookName = data['bookName'];
        const lastChapter = data['verses'][data['verses'].length - 1].chapter;
        let chapterNum = 1;

        const title = document.getElementById('book-title');
        title.innerText = `${bookName}`;

        let verses = data['verses'].filter(verse => verse.chapter === chapterNum);
        loadChapter(chapterNum);

        const selectChapterBtn = document.getElementById('select-chapter');
        const prevBtn = document.getElementById('prev');
        const nextBtn = document.getElementById('next');

        selectChapterBtn.onclick = () => {
            let chapterList = document.getElementById('chapter-list');
            console.log(chapterList);

            if  (chapterList === null) {
                chapterList = document.createElement('div');
                chapterList.id = 'chapter-list';
                
                let element = null;
                for (let i = 1; i <= lastChapter; i++) {
                    element = document.createElement('div')
                    element.innerText = i;
                    element.classList.add('verse-n');

                    element.onclick = () => {
                        chapterNum = i;
                        verses = data['verses'].filter(verse => verse.chapter === chapterNum);
                        loadChapter(chapterNum);
                    }   

                    chapterList.appendChild(element);   
                }

                selectChapterBtn.appendChild(chapterList);
            }
            else {
                chapterList.remove();
            }

        };

        prevBtn.onclick = () => {
            chapterNum--;
            verses = data['verses'].filter(verse => verse.chapter === chapterNum);

            if (verses.length === 0) {
                chapterNum++;
            }
            else {
                loadChapter(chapterNum);
            }
        };

        nextBtn.onclick = () => {
            chapterNum++;
            verses = data['verses'].filter(verse => verse.chapter === chapterNum);

            if (verses.length === 0) {
                chapterNum--;
            }
            else {
                loadChapter(chapterNum);
            }        
        };

        function loadChapter(chapterNum) {
            const headerCont = document.getElementById('header');

            const bookNameHeader = headerCont.querySelector(':scope > #book-name');
            const selectChapterBtn = headerCont.querySelector(':scope > #select-chapter');
            const chapterNumSpan = selectChapterBtn.querySelector(':scope > #chapter-num');

            bookNameHeader.innerText = bookName;
            chapterNumSpan.innerText = `Chapter ${chapterNum}`;

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
