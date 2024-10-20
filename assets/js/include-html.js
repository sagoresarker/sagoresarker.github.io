function includeHTML() {
    const includeElements = document.querySelectorAll('[include-html]');
    includeElements.forEach(async (element) => {
        const file = element.getAttribute('include-html');
        try {
            const response = await fetch(file);
            if (response.ok) {
                const html = await response.text();
                element.innerHTML = html;
                element.removeAttribute('include-html');
            } else {
                console.error(`Failed to load ${file}`);
            }
        } catch (error) {
            console.error(`Error loading ${file}:`, error);
        }
    });
}

document.addEventListener('DOMContentLoaded', includeHTML);
