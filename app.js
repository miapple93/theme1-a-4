const button = document.getElementById('add-button');
const input = document.getElementById('people-input');
const list = document.getElementById('people-list');
const statusMessage = document.getElementById('status-message');

const showStatusMessage = (message) => {
    if (!statusMessage) {
        return;
    }

    statusMessage.textContent = message;
    statusMessage.classList.add('visible');

    clearTimeout(showStatusMessage.timerId);
    showStatusMessage.timerId = setTimeout(() => {
        statusMessage.textContent = '';
        statusMessage.classList.remove('visible');
    }, 2000);
};

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
        li.classList.add('registered-name');
        list.appendChild(li);

        showStatusMessage(`${name}を登録しました。`);

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
