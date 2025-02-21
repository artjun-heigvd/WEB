import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
	const [games, setGames] = useState([]);

	const fetchGames = async () => {
		const response = await fetch('http://localhost:8080/api/games');
		const data = await response.json();
		setGames(data);
	};

	const createGame = async (event) => {
		event.preventDefault();
		const data = new FormData(event.target);
		if (data.has('id')) {
			const id = data.get('id');
			await fetch('http://localhost:8080/api/games', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ id }),
			});
		}
		fetchGames();
	};

	useEffect(() => {
		fetchGames();
	}, []);

	return (
		<div>
			<h1>Mastermind</h1>
			<h2>Create a new game</h2>
			<form onSubmit={createGame}>
				<input type="text" name="id" placeholder="Identifier" />
				<input type="submit" value="Create" />
			</form>

			<h2>Existing games</h2>
			<ul style={{ listStyleType: 'none' }}>
				{games.map((game) => (
					<li key={game}>
						<Link to={`/${game}`}>{game}</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Home;
