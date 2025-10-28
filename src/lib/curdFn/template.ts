import { getCurUserPromise } from '$lib/db/auth';
import { db } from '$lib/db/db.schema';
import type { TemplateSchemaType } from '$lib/schema/templateSchema';
import { consola } from 'consola';
import { nanoid } from 'nanoid';

type Template = TemplateSchemaType & { create_by: string };

export async function createTemplateAction(template: Omit<TemplateSchemaType, 'id'>): Promise<Template> {
	if (!template) throw new Error('Template data is not defined');

	const curUser = await getCurUserPromise();
	if (!curUser) throw new Error('User is not authenticated');

	const templateId = nanoid();
	const templateRef = db.templates.id(templateId);

	const dataToSet = {
		...template,
		create_by: curUser.uid
	};

	await db.templates.set(templateRef, dataToSet);

	consola.success('createTemplateAction', dataToSet);

	return { ...dataToSet, id: templateId };
}

export async function editTemplateAction(
	templateId: string,
	template: Partial<TemplateSchemaType>
): Promise<Template | null> {
	if (!templateId) throw new Error('Template ID is not defined');
	if (!template) throw new Error('Template data is not defined');

	const id = db.templates.id(templateId);
	await db.templates.update(id, template);

	consola.success('editTemplateAction', template);

	const updatedDoc = await db.templates.get(templateId);
	if (!updatedDoc) return null;

	return { ...updatedDoc.data, id: updatedDoc.ref.id };
}

export async function getTemplateAction(templateId: string): Promise<Template | null> {
	if (!templateId) throw new Error('Template ID is not defined');

	const templateDoc = await db.templates.get(templateId);

	if (!templateDoc) {
		consola.error('getTemplateAction: Template not found');
		return null;
	}

	consola.success('getTemplateAction');
	return { ...templateDoc.data, id: templateDoc.ref.id };
}

export async function getTemplatesAction(): Promise<Template[]> {
	const curUser = await getCurUserPromise();
	if (!curUser || !curUser.uid) throw new Error('User is not authenticated');

	try {
		const templateDocs = await db.templates.query(($) => $.field('create_by').eq(curUser.uid));
		consola.success('getTemplatesAction');
		return templateDocs.map((doc) => ({ ...doc.data, id: doc.ref.id }));
	} catch (e) {
		consola.error(e);
		return [];
	}
}

export async function removeTemplateAction(templateId: string) {
	if (!templateId) throw new Error('Template ID is not defined');

	const id = db.templates.id(templateId);
	await db.templates.remove(id);

	consola.success('removeTemplateAction');
	return { id: templateId };
}