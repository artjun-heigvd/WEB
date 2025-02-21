import React, { useState } from 'react';
import Peg from './Peg';

const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];

const GuessForm = ({ onSubmit }) => {
	const [guess, setGuess] = useState([null, null, null, null]);
	const [error, setError] = useState(null);

	const handleSubmit = (event) => {
		event.preventDefault();
		const allColorsSelected =
			guess.filter((color) => color === null).length === 0;
		if (!allColorsSelected) {
			setError('Please select a color for each position');
			return;
		}
		onSubmit(guess);
	};

	const handlePegClick = (color, index) => {
		setError(null);
		guess[index] = color;
		setGuess([...guess]);
	};

	return (
		<form
			onSubmit={handleSubmit}
			style={{ borderTop: 'solid 2px black', paddingTop: '1rem' }}
		>
			{error && <div style={{ color: 'red', padding: '8px' }}>{error}</div>}
			{colors.map((color) => (
				<ColorPegRow
					key={color}
					color={color}
					guess={guess}
					onPegClick={handlePegClick}
				/>
			))}
			<button type="submit" style={{ marginTop: '1rem' }}>
				Guess
			</button>
		</form>
	);
};

const ColorPegRow = ({ color, guess, onPegClick }) => {
	return (
		<div style={{ display: 'flex', gap: '1rem' }}>
			{guess.map((selectedColor, index) => (
				<Peg
					key={index}
					color={color}
					borderWidth={selectedColor === color ? '4px' : '2px'}
					onClick={() => onPegClick(color, index)}
				/>
			))}
		</div>
	);
};

export default GuessForm;
