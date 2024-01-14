export class ScriptUtil {
    static bodyClass(strClass: string): void {
        const body = document.body;
        body.classList.add(strClass);
    }

    static loadScript(url: string): void {
        const body = document.body as HTMLDivElement;
        const script = document.createElement('script');
        script.innerHTML = '';
        script.src = url;
        script.async = true;
        script.defer = true;
        body.appendChild(script);
    }

    static setScrollTop(animation?: boolean): void {
        const scrollToTop = window.setInterval(() => {
            const pos = window.pageYOffset;
            if (pos > 0) {
                window.scrollTo(0, animation ? pos - 20 : 0);
            } else {
                window.clearInterval(scrollToTop);
            }
        }, 0);
    }

    static onToggleSidebar(isOpened: boolean): void {
        // LocalStorageUtil.setStateSidebar(isOpened);
        if (isOpened) {
            document.body.classList.add('m-brand--minimize', 'm-aside-left--minimize');
        } else {
            document.body.classList.remove('m-brand--minimize', 'm-aside-left--minimize');
        }
    }

    static appendBadgeToSidebar(soLuong: number, type: string): void {
        const htmlElements = document.getElementsByClassName(type);
        if (soLuong > 0 && htmlElements.length > 0) {
            // set notification
            setTimeout(() => {
                document.getElementsByClassName(type)[0].innerHTML = `<span class="m-badge m-badge--danger" > ${soLuong} </span>`;
            }, 100);
        } else {
            if (htmlElements.length > 0) {
                document.getElementsByClassName(type)[0].innerHTML = '';
            }
        }
    }

    static formatHtmlToSendMail(htmlString: string): string {
        const html = document.createElement('div');
        html.innerHTML = htmlString;

        // format tag figure
        const allFigure = html.querySelectorAll('figure');
        allFigure.forEach(item => (item.style.margin = 'auto'));

        // format tag img
        const allImage = html.querySelectorAll('img');
        allImage.forEach(item => (item.style.width = '100%'));

        const templateHtml = `
                <div style="background: #f2f2f2; padding: 30px 0">
                    <div style="
                        max-width: 800px;
                        margin: auto;
                        background: #ffffff;
                        border: 1px solid #e6e6e6;
                        padding: 20px;
                        border-radius: 4px">
                        ${html.innerHTML}
                    </div>
                </div>
            `;

        return templateHtml;
    }
}
