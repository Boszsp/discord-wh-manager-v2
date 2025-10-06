import { marked, type Token, type TokensList } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import markedShiki from 'marked-shiki'
import { codeToHtml } from 'shiki'
export async function convertMdToHTML(str: string) {
    function processAllTokens(tokens: TokensList | Token[]): TokensList | Token[] {
        console.log(tokens)
        return tokens.map((v) => {
            if (v.type === "heading" && v.raw.startsWith("####")) {
                v.type = "paragraph"
                v.text = v.raw
                if (v.tokens?.[0] && v.tokens?.[0])
                    (v.tokens[0] as any).text = v.text
            }
            console.log(v)
            return v
        })
    }
    marked.use({ hooks: { processAllTokens } })
    marked.use(
        markedShiki({
            async highlight(code, lang) {
                return await codeToHtml(code, {
                    lang, theme: 'github-dark-default' })
            },
            container: `<figure class="highlighted-code">%s</figure>`}
        )
    )

    const clean = DOMPurify.sanitize((await marked(str)))

    return clean
}