import { BLACKLIST_TIPTAP_URL } from "@/app/config";
import { sanitizeUrl } from "strict-url-sanitise";

interface ValidateUrlOptions {
    url: string;
    allowedProtocols?: string[];
    defaultValidate?: (url: string) => boolean;
}

export function validateUrl({
    url,
    allowedProtocols = ['https'],
    defaultValidate = (url: string) => true,
}: ValidateUrlOptions): boolean {
    try {
        // Sanitize URL - nếu strict-url-sanitise phát hiện nguy hiểm, trả về 'about:invalid#zClosurez'
        const sanitized = sanitizeUrl(url);

        // Parse URL, nếu parse fail → không hợp lệ
        const parsedUrl = new URL(sanitized);

        // Default validation
        if (!defaultValidate(parsedUrl.href)) return false;

        // Protocol check
        const protocol = parsedUrl.protocol.replace(':', '');
        if (!allowedProtocols.includes(protocol)) return false;

        // Blacklist domain
        if (BLACKLIST_TIPTAP_URL.includes(parsedUrl.hostname)) return false;

        return true;
    } catch(e) {
        return false; // parse fail hoặc exception → không hợp lệ
    }
}
