import type { ServerSchemaType } from '$lib/schema/serverSchema';
import type { TemplateSchemaType } from '$lib/schema/templateSchema';
import type { webhookSchemaType } from '$lib/schema/webhookSchema';
import { schema, type Typesaurus } from 'typesaurus';
import { firebaseapp } from './init';

// Generate the db object from given schem that you can use to access
// Firestore, i.e.:
//   await db.get(userId)
export const db = schema(
	($) => ({
		servers: $.collection<Server>().sub({
			channels: $.collection<webhookSchemaType>()
		}),
		templates: $.collection().sub(
			{
				template: $.collection<Template>()
			}
		)
	}),
	{
		app: firebaseapp.name
	}
);

export type SchemaType = Typesaurus.Schema<typeof db>;

interface Server extends ServerSchemaType {
	create_by: string;
}

interface Template extends TemplateSchemaType {
}
