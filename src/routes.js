import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePaths } from './utils/build-route-paths.js'

const database = new Database()

export const routes = [
	{
		method: 'GET',
		path: buildRoutePaths('/tasks'),
		handle: (req, res) => {
			const { search } = req.query;
			
			const tasks = database.select('tasks', search ? { 
				title: search,
				description: search
			}: null);
			return res.end(JSON.stringify(tasks))
		}
	},
	{
		method: 'POST',
		path: buildRoutePaths('/tasks'),
		handle: (req, res) => {
			const { title, description } = req.body;

			if (!title || !description) {
				return res.writeHead(400).end(JSON.stringify(
					{message: 'you must send description and title!'}
				));
			}
			
			database.insert('tasks', {
				id: randomUUID(),
				title,
				description,
				completed_at: null,
				created_at: new Date(),
				updated_at: new Date()
			});
			return res.writeHead(201).end(JSON.stringify({
				message: 'Task created successfully'
			}));
		}
	},
	{
		method: 'PUT',
		path: buildRoutePaths('/tasks/:id'),
		handle: (req, res) => {
			const { id } = req.params;
			const body = req.body;
			
			const result = database.update('tasks', id, {
				...body,
				updated_at: new Date()
			});
			
			return res.writeHead(200).end(result);
		}
	},
	{
		method: 'PATCH',
		path: buildRoutePaths('/tasks/:id/complete'),
		handle: (req, res) => {
			const { id } = req.params;
			
			const result = database.update('tasks', id, {
				completed_at: new Date(),
				updated_at: new Date()
			});
			return res.writeHead(200).end(result);
		}
	},
	{
		method: 'DELETE',
		path: buildRoutePaths('/tasks/:id'),
		handle: (req, res) => {
			const { id } = req.params;
			
			database.delete('tasks', id);
			return res.writeHead(204).end('Task deleted successfully');
		}
	}
];
