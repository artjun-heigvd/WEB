import Pin from './Pin';

const Feedback = ({ feedback }) => {
	let correctPins = []; // Correct color and position
	let almostCorrectPins = []; // Correct color, wrong position

	for (let i = 0; i < feedback.blackPins; i++) {
		correctPins.push(<Pin color="black" key={i} />);
	}

	for (let i = 0; i < feedback.whitePins; i++) {
		almostCorrectPins.push(<Pin color="white" key={i} />);
	}

	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(2, 1fr)',
				gridTemplateRows: 'repeat(2, 1fr)',
				gap: '0.5rem',
			}}
		>
			{correctPins}
			{almostCorrectPins}
		</div>
	);
};

export default Feedback;
