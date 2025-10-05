import Link from '@tiptap/extension-link';
import { validateUrl } from './validator';

export const LinkNode = Link.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            text: {
                default: null,
                parseHTML: element => element.textContent, // lấy text từ HTML
                renderHTML: attributes => {
                    // không render text thành attr, chỉ trả href
                    return {}
                },
            },
        }
    }
}).configure({
    openOnClick: false,
    protocols: ['https'],
    linkOnPaste: true,
    autolink: false,
    isAllowedUri: (url, ctx) => {
        return validateUrl({
            url,
            allowedProtocols: ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme)),
            defaultValidate: ctx.defaultValidate,
        });
    }
})