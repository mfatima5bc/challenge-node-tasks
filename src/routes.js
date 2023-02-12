import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePaths } from './utils/build-route-paths.js'

const database = new Database()

export const routes = [
	{
		method: 'GET',
		path: buildRoutePaths('/tasks'),
		handle: (req, res) => {
			const { title, description} = req.query;
			console.log(req.query);
			const tasks = database.select('tasks', {
				title: title ? title.replaceAll('%20', ' ') : null,
				description: description ? description.replaceAll('%20', ' ') : null
			});
			return res.end(JSON.stringify(tasks))
		}
	},
	{
		method: 'POST',
		path: buildRoutePaths('/tasks'),
		handle: (req, res) => {
			const { title, description} = req.body;
			
			database.insert('tasks', {
				id: randomUUID(),
				title,
				description,
				completed_at: null,
				created_at: new Date(),
				updated_at: new Date()
			});
			return res.writeHead(201).end('Task created successfully');
		}
	}
];
