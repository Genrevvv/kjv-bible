const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString)
const bookID = urlParams.get('bookID');

fetch(`/books/${bookID}`)
    .then(res => res.json())
    .then(data => {
        localStorage.setItem('bookID', bookID);
        
        console.log(data);

        const bookSection = data['bookSection'];
        const bookName = data['bookName'];
        const verses = data['verses'].filter(verse => verse.chapter === 1);

        // history.replaceState(null, '', `/${bookSection}/${bookName.toLowerCase()}`);

        const title = document.getElementById('book-title');
        title.innerText = `${bookName}`;

        const headerCont = document.getElementById('header');
        headerCont.innerHTML = `<h1>${bookName}</h1>
                                <h3>Chapter 1</h3>`;

        const versesCont = document.getElementById('verses');

        let verseElmnt = null;
        for (verse of verses) {
            verseElmnt = document.createElement('div');
            verseElmnt.innerHTML = `<span>${verse['verse']}</span>
                                    <p>${verse['text']}</p>`;

            versesCont.appendChild(verseElmnt);
        }
});

window.addEventListener('load', () => {
    //window.location.href = path;
    const bookID = localStorage.getItem('bookID');
    console.log(bookID);
    // history.replaceState(null, '', `/book.html?bookID=${bookID}`);
    console.log("adada");
});
