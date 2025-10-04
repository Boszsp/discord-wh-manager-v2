import { marked } from 'marked';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
export async function convertMdToHTML(str: string) {
    return await marked(str)
    const window = new JSDOM('').window;
    const purify = DOMPurify(window);
    const clean = purify.sanitize('<b>hello there</b>');
}