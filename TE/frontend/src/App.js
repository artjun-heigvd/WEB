import React from 'react';

import './App.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './pages/Home';
import Game from './pages/Game';

function App() {
	const router = createBrowserRouter([
		{
			path: '/',
			element: <Home />,
		},
		{
			path: '/:id',
			element: <Game />,
		},
	]);
	return (
		<div className="App">
			<React.StrictMode>
				<RouterProvider router={router} />
			</React.StrictMode>
		</div>
	);
}

export default App;
