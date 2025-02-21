import { Link } from "react-router-dom";
import React, {useEffect, useState} from "react";

function Books() {
    const [bookName, setBookName] = useState("");
    const [bookAuthor, setBookAuthor] = useState("");
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/api/books').then(response => response.json()).then(
            data => setBooks(data)
        )
    }, []);

    async function handleCreate(){
        await fetch('http://localhost:4000/api/books', {
            method: 'POST',
            headers: {
                'accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({author: bookAuthor, title: bookName}),
        })
    }

    async function handleDelete(bookId){
        await fetch(`http://localhost:4000/api/books/${bookId}`, {
            method: 'DELETE',
            headers: {
                'accept' : '*/*',
            },
        })
    }

    return (
        <div>
            <h1>Books management</h1>
            <h2>Create a new book</h2>
            <form onSubmit={handleCreate}>
                <input
                    type="Author"
                    placeholder="Author"
                    value={bookAuthor}
                    onChange={(e) => setBookAuthor(e.target.value)}
                />
                <input
                    type="Title"
                    placeholder="Title"
                    value={bookName}
                    onChange={(e) => setBookName(e.target.value)}
                />
                <input type="submit" value="Create"/>
            </form>
            <h2>Existing books</h2>
            <ul>
                {books.map((book) => (
                    <li key={book.id}>
                        <Link to={`/books/${book.id}`}>{book.title} - {book.author}</Li// Rajouter les boutons Edit et Delete qui appelle les bons Link to
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Books;