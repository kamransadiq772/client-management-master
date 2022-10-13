//@ts-check

import Schema from 'schemas/Schema.class';

const Client = new Schema({
	name: 'Client',
	fields: [
		{
			id: '_id',
			type: 'int',
			hidden: true,
			isPrimaryKey: true,
		},
		{
			id: 'clientName',
			type: 'string',
			identifier: true,
		},
		{
			id: 'anydesk',
			type: 'object',
			getValue: object => {
				const { address, password } = object.anydesk;
				if (!(address || password)) return undefined;
				if (!(address && password)) throw new Error('Anydesk Address & Password Must Both Be Filled Or Unfilled');
				return { address, password };
			},
			fields: [
				{
					id: 'address',
					type: 'string',
					canBeNull: true,
				},
				{
					id: 'password',
					type: 'password',
					canBeNull: true,
				},
			],
		},
		{
			id: 'server',
			type: 'object',
			getValue: object => {
				const { ip, username, password } = object.server;
				if (!(ip || username || password)) return undefined;
				if (!(ip && username && password)) throw new Error('Server IP, Username, & Password Must All Be Filled Or Unfilled');
				return { ip, username, password };
			},
			fields: [
				{
					id: 'ip',
					type: 'string',
					canBeNull: true,
				},
				{
					id: 'username',
					type: 'string',
					canBeNull: true,
				},
				{
					id: 'password',
					type: 'password',
					canBeNull: true,
				},
			],
		},
		{
			id: 'frontend',
			type: 'object',
			getValue: object => {
				const { address, username, password } = object.frontend;
				if (!(address || username || password)) return undefined;
				if (!(address && username && password)) throw new Error('Frontend Address, Username, & Password Must All Be Filled Or Unfilled');
				return { address, username, password };
			},
			fields: [
				{
					id: 'address',
					type: 'string',
					canBeNull: true,
				},
				{
					id: 'username',
					type: 'string',
					canBeNull: true,
				},
				{
					id: 'password',
					type: 'password',
					canBeNull: true,
				},
			],
		},
		{
			id: 'backend',
			type: 'object',
			getValue: object => {
				const { address } = object.backend;
				if (!address) return undefined;
				return { address };
			},
			fields: [
				{
					id: 'address',
					type: 'string',
					canBeNull: true,
				},
			],
		},
		{
			id: 'reportingServer',
			type: 'object',
			getValue: object => {
				const { address, username, password } = object.reportingServer;
				if (!(address || username || password)) return undefined;
				if (!(address && username && password)) throw new Error('Reporting Server Address, Username, & Password Must All Be Filled Or Unfilled');
				return { address, username, password };
			},
			fields: [
				{
					id: 'address',
					type: 'string',
					canBeNull: true,
				},
				{
					id: 'username',
					type: 'string',
					canBeNull: true,
				},
				{
					id: 'password',
					type: 'password',
					canBeNull: true,
				},
			],
		},
	],
});

export default Client.schema;