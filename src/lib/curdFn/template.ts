import { getCurUserPromise } from '$lib/db/auth';
import { db } from '$lib/db/db.schema';
import { DEFAULT_ID_LENGTH } from '$lib/default';
import type { TemplateSchemaType } from '$lib/schema/templateSchema';
import { loadTempCache, saveTempCache } from '$lib/store/temp-cache.svelte';
import { consola } from 'consola';
import { nanoid } from 'nanoid';

// NOTE: This type is based on db.schema.ts. 
// It seems there might be a mistake in the schema, as templates usually have a create_by field.
// But as requested, the CRUD functions are generated based on the existing schema.


interface FnResponse {
	status: number;
	message: 'success' | 'error';
	templateId: string;
	affectedTemplate: TemplateSchemaType | Partial<TemplateSchemaType>;
}

export async function createTemplateAction(
	template: Omit<TemplateSchemaType, 'id'>
): Promise<FnResponse> {
	if (!template) throw new Error('Template data is not defined');

	const curUser = await getCurUserPromise();
	if (!curUser) throw new Error('User is not authenticated');

	const templateId = nanoid(DEFAULT_ID_LENGTH);
	const templateURef = db.templates.id(curUser?.uid);
	const templateRef = db.templates(templateURef).template.id(templateId);

	const dataToSet = {
		...template,
		//id: templateId // Initialize templates as an empty array as per schema
	};

	await db.templates(templateURef).template.set(templateRef, dataToSet);

	consola.success('createTemplateAction', dataToSet);

	return {
		status: 200,
		message: 'success',
		templateId: templateId,
		affectedTemplate: { ...dataToSet, id: templateId }
	};
}

export async function editTemplateAction(
	templateId: string,
	template: Partial<TemplateSchemaType>
): Promise<FnResponse> {
	if (!templateId) throw new Error('Template ID is not defined');
	if (!template) throw new Error('Template data is not defined');
	const curUser = await getCurUserPromise();
	if (!curUser) throw new Error('User is not authenticated');

	const templateUId = db.templates.id(curUser?.uid);

	const id = db.templates(templateUId).template.id(templateId);
	await db.templates(templateUId).template.update(id, template);

	consola.success('editTemplateAction', template);

	return {
		status: 200,
		message: 'success',
		templateId: templateId,
		affectedTemplate: { ...template, id: templateId }
	};
}

export async function getTemplateAction(templateId: string): Promise<TemplateSchemaType | null> {
	if (!templateId) throw new Error('Template ID is not defined');
	const curUser = await getCurUserPromise();
	if (!curUser) throw new Error('User is not authenticated');
	const cache = loadTempCache(`template-${templateId}`);
	if (cache) {
		consola.success('getTemplateAction Cache');
		return cache;
	}

	const templateUId = db.templates.id(curUser?.uid);
	const templateRefId = db.templates(templateUId).template.id(templateId);

	const templateDoc = await db.templates(templateUId).template.get(templateRefId);

	if (!templateDoc) {
		consola.error('getTemplateAction: Template not found');
		return null;
	}
	const result = { ...templateDoc.data, id: String(templateDoc.ref.id)};
	saveTempCache(`template-${templateId}`, result);

	consola.success('getTemplateAction');
	return result;
}

export async function getTemplatesAction(): Promise<TemplateSchemaType[]> {
	const curUser = await getCurUserPromise();
	if (!curUser || !curUser.uid) throw new Error('User is not authenticated');

	// Cannot query by user, so fetching all templates.
	const cache = loadTempCache(`templates-all`);
	if (cache) {
		consola.success('GetTemplatesAction Cache');
		return cache;
	}

	try {
		const templateUId = db.templates.id(curUser?.uid);
		const templateDocs = await db.templates(templateUId).template.all();
		const result = templateDocs.map((doc) => ({ ...doc.data, id: String(doc.ref.id)}));
		saveTempCache(`templates-all`, result);
		consola.success('getTemplatesAction');
		return result;
	} catch (e) {
		consola.error(e);
		return [];
	}
}

export async function removeTemplateAction(templateId: string) {
	if (!templateId) throw new Error('Template ID is not defined');
	const curUser = await getCurUserPromise();
	if (!curUser) throw new Error('User is not authenticated');

	const id = db.templates.id(templateId);
	await db.templates.remove(id);

	consola.success('removeTemplateAction');
	return { id: templateId };
}