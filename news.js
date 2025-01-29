// Load every pages under news folder
// made by copilot, i can't read this shit
const newDiv = document.querySelector('.newbox');
if (newDiv) {
    const newsContainer = document.createElement('div');

    let links = [];
    fetch('./berita')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            links = Array.from(doc.querySelectorAll('a'))
                .map(a => a.getAttribute('href'))
                .filter(link => link && link.endsWith('.html') && !link.endsWith('index.html')); 
            return Promise.all(links.map(link => fetch(link).then(res => res.text())));
        })
        .then(pages => {
            pages.forEach((page, index) => {
                const pageDoc = new DOMParser().parseFromString(page, 'text/html');
                const h1Element = pageDoc.querySelector('h1');
                const pElement = pageDoc.querySelector('p');
                const h1Content = h1Element ? h1Element.textContent : 'No title';
                const pContent = pElement ? pElement.textContent.split(' ').slice(0, 10).join(' ') + ' ...' : 'No content';

                const h1 = document.createElement('h1');
                const a = document.createElement('a');
                a.href = links[index];
                a.textContent = h1Content;
                a.style.color = '#009ad6'; // Add this line to remove the blue link color
                a.style.textDecoration = 'none'; // Add this line to remove the underline

                h1.appendChild(a);

                const p = document.createElement('p');
                p.textContent = pContent;

                const articleDiv = document.createElement('div');
                articleDiv.appendChild(h1);
                articleDiv.appendChild(p);

                newsContainer.appendChild(articleDiv);
            });

            newDiv.appendChild(newsContainer);
        })
        .catch(error => console.error('Error fetching the HTML:', error));
}
