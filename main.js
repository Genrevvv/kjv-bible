const books = new Map();

fetch('/get-books')
    .then(res => res.json())
    .then(data => {
        const booksCont = document.getElementById('books');
        const oldTestamentCont= booksCont.querySelector('#old-testament');
        const newTestamentCont= booksCont.querySelector('#new-testament');

        let book = {
            dom: null,
            id: 0,
            name: '',
        }

        for (let i = 0; i < data.length; i++) {
            book.id = data[i]['id'];
            book.name = data[i]['name'];
            
            book.dom = document.createElement('div');
            book.dom.classList.add('book');
            book.dom.innerText = `${book.name}`;
            book.dom.onclick = getBook;

            books.set(book.dom, book.id);

            if (book.id < 40) {
                oldTestamentCont.appendChild(book.dom);
            }
            else {
                newTestamentCont.appendChild(book.dom);
            }
        }
});

function getBook(event) {   
    const book = event.target;
    const bookID = books.get(book);

    const options = {
        method: 'POST',
        header: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookID: bookID })
    };

    fetch('/get-books', options)
        .then(res => res.json())
        .then(data => {
            window.location.href = `/${data['section']}/` + data['name'].replaceAll(' ', '-').toLowerCase();
        })

    // console.log(`/books/${bookID}`);

    // window.location.href = `book.html?bookID=${bookID}`;

    /*
    fetch(`/books/${bookID}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
        });
    */
}