export function useTitle(title: string) {
    let t: HTMLTitleElement | null = document.querySelector('title')
    if (t!==null) {
        t.textContent = title
    }
}
