
const button = document.getElementById('add-button');
const input = document.getElementById('people-input');
const list = document.getElementById('people-list');

button.addEventListener('click', () => {
    const name = input.value.trim();

    if (name === '') {
        return;
    }

    const li = document.createElement('li');
    li.textContent = name;

    list.appendChild(li);

    input.value = '';
});
