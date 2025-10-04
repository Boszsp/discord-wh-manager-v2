import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
export async function convertMdToHTML(str: string) {
    const clean = DOMPurify.sanitize((await marked(str)))
    return clean
}