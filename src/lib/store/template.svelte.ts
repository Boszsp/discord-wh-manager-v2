import { writable } from 'svelte/store';
import type { TemplateSchemaType } from '$lib/schema/templateSchema';

const isBrowser = typeof window !== 'undefined';

const initialValue: TemplateSchemaType[] = isBrowser
    ? JSON.parse(window.localStorage.getItem('templates') || '[]')
    : [];

const { subscribe, set, update } = writable<TemplateSchemaType[]>(initialValue);

subscribe((value) => {
    if (isBrowser) {
        window.localStorage.setItem('templates', JSON.stringify(value));
    }
});

function addTemplate(template: TemplateSchemaType) {
    update((templates) => [...templates, template]);
}

function updateTemplate(template: TemplateSchemaType) {
    update((templates) => {
        const index = templates.findIndex((t) => t.name === template.name);
        if (index !== -1) {
            templates[index] = template;
        }
        return templates;
    });
}

function deleteTemplate(templateName: string) {
    update((templates) => templates.filter((t) => t.name !== templateName));
}

export const templateStore = {
    subscribe,
    set,
    update,
    addTemplate,
    updateTemplate,
    deleteTemplate
};
