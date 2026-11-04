
const button = document.getElementById('add-button');
const input = document.getElementById('people-input');
const list = document.getElementById('people-list');
const statusMessage = document.getElementById('status-message');

const dateInput = document.getElementById('recruit-date');
const startInput = document.getElementById('start-time');
const endInput = document.getElementById('end-time');
const saveButton = document.getElementById('save-recruitment');
const adminStatus = document.getElementById('admin-status');
const recruitmentInfo = document.getElementById('recruitment-info');

const STORAGE_KEY = 'recruitmentInfo';
const PEOPLE_STORAGE_KEY = 'registeredPeople';

// 登録完了メッセージ
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

// 募集情報を表示する
const displayRecruitment = () => {
    if (!recruitmentInfo) {
        return;
    }

    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
        recruitmentInfo.textContent = '現在、募集情報はありません。';
        return;
    }

    try {
        const data = JSON.parse(savedData);

        const [year, month, day] = data.date.split('-');
        const formattedDate =
            `${year}年${Number(month)}月${Number(day)}日`;

        recruitmentInfo.replaceChildren();

        const title = document.createElement('h3');
        title.textContent = '現在の募集内容';

        const dateText = document.createElement('p');
        dateText.textContent = `募集日：${formattedDate}`;

        const timeText = document.createElement('p');
        timeText.textContent =
            `募集時間：${data.start} ～ ${data.end}`;

        recruitmentInfo.append(title, dateText, timeText);

    } catch (error) {
        recruitmentInfo.textContent = '募集情報を読み込めませんでした。';
    }
};

// 管理者が募集内容を登録する
if (saveButton && dateInput && startInput && endInput) {
    saveButton.addEventListener('click', () => {

        const date = dateInput.value;
        const start = startInput.value;
        const end = endInput.value;

        if (!date || !start || !end) {
            if (adminStatus) {
                adminStatus.textContent =
                    '日付と開始・終了時間を入力してください。';
            }
            return;
        }

        if (start >= end) {
            if (adminStatus) {
                adminStatus.textContent =
                    '終了時間は開始時間より後にしてください。';
            }
            return;
        }

        const recruitmentData = {
            date: date,
            start: start,
            end: end
        };

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(recruitmentData)
        );

        if (adminStatus) {
            adminStatus.textContent = '募集内容を登録しました！';
        }

        displayRecruitment();
    });
}

// 従業員が名前を登録する
if (!button || !input || !list) {
    console.error('必要な要素が見つかりません。HTMLのIDを確認してください。');
} else {

    // 保存された名前を読み込む
    let people = [];

    try {
        people = JSON.parse(
            localStorage.getItem(PEOPLE_STORAGE_KEY) || '[]'
        );

        if (!Array.isArray(people)) {
            people = [];
        }
    } catch (error) {
        people = [];
    }

    // 名前を保存する
    const savePeople = () => {
        localStorage.setItem(
            PEOPLE_STORAGE_KEY,
            JSON.stringify(people)
        );
    };

    // 出勤可能者一覧を表示する
    const displayPeople = () => {
        list.replaceChildren();

        people.forEach((name, index) => {

            const li = document.createElement('li');
            li.classList.add('registered-name');

            // 名前を表示する
            const span = document.createElement('span');
            span.textContent = name;

            // 削除ボタンを作成する
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '削除';
            deleteButton.type = 'button';
            deleteButton.classList.add('delete-button');

            // 削除ボタンを押したとき
            deleteButton.addEventListener('click', () => {

                // 指定した名前を削除
                people.splice(index, 1);

                // 削除後の一覧を保存
                savePeople();

                // 一覧を再表示
                displayPeople();

                showStatusMessage(`${name}を削除しました。`);
            });

            // 名前と削除ボタンを一覧に追加
            li.appendChild(span);
            li.appendChild(deleteButton);
            list.appendChild(li);
        });
    };

    // 名前を追加する
    const addPerson = () => {

        const name = input.value.trim();

        if (name === '') {
            return;
        }

        // 名前を配列に追加
        people.push(name);

        // 名前を保存
        savePeople();

        // 一覧を更新
        displayPeople();

        showStatusMessage(`${name}を登録しました。`);

        input.value = '';
        input.focus();
    };

    // OKボタンで登録
    button.addEventListener('click', addPerson);

    // Enterキーで登録
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addPerson();
        }
    });

    // ページを開いたときに保存済みの名前を表示
    displayPeople();

    // 別タブで名前が変更された場合も更新
    window.addEventListener('storage', (event) => {
        if (event.key === PEOPLE_STORAGE_KEY) {
            try {
                people = JSON.parse(event.newValue || '[]');

                if (!Array.isArray(people)) {
                    people = [];
                }
            } catch (error) {
                people = [];
            }

            displayPeople();
        }
    });
}

// 最初に募集情報を表示
displayRecruitment();

// ページ切り替え時に更新
window.addEventListener('hashchange', displayRecruitment);

// 別タブで募集情報が変更された場合も更新
window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
        displayRecruitment();
    }
});
