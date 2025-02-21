import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
function Edit() {
    const {bookId} = useParams();
    const [bookName, setBookName] = useState("");
    const [bookAuthor, setBookAuthor] = useState("");
    const [bookInfo, setBookInfo] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:4000/api/books/${bookId}`).then( response => response.json()).then(
            data => setBookInfo(data)
        )
    }, [bookId]);

    async function handleUpdate(){
        // Comme handle Create ou Delete dans Books.jsx mais avec le bon formulaire
    }


    return (
        <div>
            <h1>Books management</h1>
            <h2>Update book</h2>
            <form onSubmit={handleUpdate}>
                <input
                    type="Author"
                    placeholder={bookInfo.author}
                    value={bookAuthor}
                    onChange={(e) => setBookAuthor(e.target.value)}
                />
                <input
                    type="Title"
                    placeholder={bookInfo.title}
                    value={bookName}
                    onChange={(e) => setBookName(e.target.value)}
                />
                <input type="submit" value="Update"/>
            </form>
        </div>
    );
};

export default Edit;