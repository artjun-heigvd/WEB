const Pin = ({ color }) => {
	return (
		<div
			style={{
				width: '10px',
				height: '10px',
				borderStyle: 'solid',
				borderColor: 'black',
				borderWidth: '2px',
				borderRadius: '50%',
				background: color,
			}}
		/>
	);
};

export default Pin;
