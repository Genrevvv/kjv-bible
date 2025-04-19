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
        
        // const bookSection = data['bookSection'];
        const bookName = data['bookName'];
        const verses = data['verses'].filter(verse => verse.chapter === 1);

        const title = document.getElementById('book-title');
        title.innerText = `${bookName}`;

        const headerCont = document.getElementById('header');
        headerCont.innerHTML = `<h1>${bookName}</h1>
                                <h3>Chapter 1</h3>`;

        const versesCont = document.getElementById('verses');

        let verseElmnt = null;
        for (verse of verses) {
            verseElmnt = document.createElement('div');
            verseElmnt.classList.add('verse');
            verseElmnt.innerHTML = `<span>${verse['verse']}</span>
                                    <p>${verse['text']}</p>`;

            versesCont.appendChild(verseElmnt);
        }
});
