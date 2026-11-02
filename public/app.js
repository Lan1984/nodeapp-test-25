const fruitList = document.querySelector('#fruit-list');
const statusMessage = document.querySelector('#status');

function addDetail(container, label, value) {
    const detail = document.createElement('div');
    detail.className = 'fruit-detail';

    const detailLabel = document.createElement('dt');
    detailLabel.textContent = label;

    const detailValue = document.createElement('dd');
    detailValue.textContent = value ?? '—';

    detail.append(detailLabel, detailValue);
    container.append(detail);
}

async function loadFruits() {
    try {
        const response = await fetch('/fruits');
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const fruits = await response.json();
        if (!Array.isArray(fruits)) {
            throw new Error('The fruit list response was not an array');
        }

        const fragment = document.createDocumentFragment();
        for (const fruit of fruits) {
            if (typeof fruit.name !== 'string') {
                continue;
            }

            const item = document.createElement('li');
            item.className = 'fruit-item';

            const heading = document.createElement('h2');
            heading.className = 'fruit-name';
            heading.textContent = fruit.name;

            const family = document.createElement('p');
            family.className = 'fruit-family';
            family.textContent = fruit.family || 'Family not available';

            const details = document.createElement('dl');
            details.className = 'fruit-details';
            addDetail(details, 'Genus', fruit.genus);

            const nutritionTitle = document.createElement('h3');
            nutritionTitle.className = 'nutrition-title';
            nutritionTitle.textContent = 'Nutrition';

            const nutrition = document.createElement('dl');
            nutrition.className = 'nutrition-list';
            const nutritionLabels = [
                ['Calories', 'calories', 'kcal'],
                ['Protein', 'protein', 'g'],
                ['Carbohydrates', 'carbohydrates', 'g'],
                ['Fat', 'fat', 'g'],
                ['Sugar', 'sugar', 'g']
            ];

            for (const [label, key, unit] of nutritionLabels) {
                const value = fruit.nutritions?.[key];
                addDetail(
                    nutrition,
                    label,
                    typeof value === 'number' ? `${value} ${unit}` : '—'
                );
            }

            item.append(heading, family, details, nutritionTitle, nutrition);
            fragment.append(item);
        }

        fruitList.replaceChildren(fragment);
        const fruitCount = fruitList.children.length;
        statusMessage.textContent = fruitCount
            ? `${fruitCount} ${fruitCount === 1 ? 'fruit' : 'fruits'}`
            : 'No fruits found.';
    } catch (error) {
        console.error('Unable to load fruits:', error);
        statusMessage.textContent = 'Could not load the fruit list. Please try again later.';
        statusMessage.classList.add('error');
    }
}

loadFruits();
