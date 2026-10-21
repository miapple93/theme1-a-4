const button = document.getElementById('add-button');
const input = document.getElementById('people-input');
const list = document.getElementById('people-list');

if (!button || !input || !list) {
    console.error('必要な要素が見つかりません。HTMLのIDを確認してください。');
} else {
    const addPerson = () => {
        const name = input.value.trim();

        if (name === '') {
            return;
        }

        const li = document.createElement('li');
        li.textContent = name;
        list.appendChild(li);

        input.value = '';
        input.focus();
    };

    button.addEventListener('click', addPerson);
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addPerson();
        }
    });
}
