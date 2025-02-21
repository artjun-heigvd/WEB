import React from 'react';
import Peg from './Peg';
import Feedback from './Feedback';

const GuessRow = ({ feedback, number }) => {
	return (
		<div
			style={{
				width: '340px',
				marginBottom: '1rem',
				display: 'flex',
				alignItems: 'center',
				gap: '2rem',
			}}
		>
			<div style={{ width: '4rem' }}>{number}</div>
			<div style={{ display: 'flex', gap: '1rem' }}>
				{feedback.guess.map((color, i) => (
					<Peg key={i} color={color} />
				))}
			</div>
			<div style={{ width: '4rem' }}>
				<Feedback feedback={feedback} />
			</div>
		</div>
	);
};

const Board = ({ game }) => {
	return (
		<div>
			{game.guesses.length === 0 && <span>Make a guess</span>}
			{game.guesses?.map((feedback, index) => (
				<GuessRow key={index} number={index + 1} feedback={feedback} />
			))}
		</div>
	);
};

export default Board;
