const Peg = ({ color, borderWidth, onClick }) => {
	return (
		<div
			style={{
				width: '40px',
				height: '40px',
				borderStyle: 'solid',
				borderColor: 'black',
				borderWidth: borderWidth,
				borderRadius: '50%',
				background: color,
				boxSizing: 'border-box',
			}}
			onClick={onClick}
		/>
	);
};

Peg.defaultProps = { borderWidth: '2px' };

export default Peg;
