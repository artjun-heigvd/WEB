const routes = require('./routes.js');

routes.listen(8080, () => {
	console.log('Server started on http://localhost:8080/api/games/test');
});
