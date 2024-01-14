import { SafeAny } from '..';

export class StringUtil {
    static contains(text: string, term: string): boolean {
        // return text.search(term) >= 0;
        return text.toLowerCase().indexOf(term.toLowerCase()) >= 0;
    }

    /**
     * "Safer" String.toLowerCase()
     */
    static lowerCase(str: string): string {
        return str.toLowerCase();
    }

    /**
     * "Safer" String.toUpperCase()
     */
    static upperCase(str: string): string {
        return str.toUpperCase();
    }

    /**
     * UPPERCASE first char of each word.
     */
    static properCase(str: string): string {
        return this.lowerCase(str).replace(/^\w|\s\w/g, this.upperCase);
    }

    /**
     * UPPERCASE first char of each sentence and lowercase other chars.
     */
    static sentenceCase(str: string): string {
        // Replace first char of each sentence (new line or after '.\s+') to
        // UPPERCASE
        return this.lowerCase(str).replace(/(^\w)|\.\s+(\w)/gm, this.upperCase);
    }

    static getTypeFile(str: string): string {
        const splitFiles = str.split('.');
        return splitFiles[splitFiles.length - 1];
    }

    static setMathMl(str: string): string {
        const wirisHtml = this.stringToHTML(str) as HTMLElement;
        const wiris = wirisHtml.querySelectorAll('.Wirisformula');
        wiris.forEach(elem => {
            const dataMathMl = StringUtil.convertMathMl(elem.getAttribute('data-mathml'));
            wirisHtml.innerHTML = wirisHtml.innerHTML.replace(elem.outerHTML, dataMathMl);
            str = wirisHtml.outerHTML;
        });

        return str;
    }

    static stringToHTML(str: string): SafeAny {
        const parser = new DOMParser();
        const doc = parser.parseFromString(str, 'text/html');
        return doc.body;
    }

    static convertMathMl(str: SafeAny): string {
        str = str.replace(/«/g, '<');
        str = str.replace(/»/g, '>');
        str = str.replace(/§/g, '&');
        str = str.replace(/¨/g, '"');
        str = str.replace(/`/g, "'");
        return str;
    }
}
