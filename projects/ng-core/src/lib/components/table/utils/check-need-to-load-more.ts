export function checkNeedToLoadMore(el: HTMLElement) {
    const buffer = el.clientHeight;
    return el.scrollTop > el.scrollHeight - el.clientHeight - buffer;
}
