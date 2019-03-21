import { version } from '../../package.json';
import { Router } from 'express';
import todos from './todo';
import users from './user';

export default ({ config, db }) => {
	let api = Router();

	api.use('/todos', todos);
	api.use('/users', users);

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
