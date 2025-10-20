document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const dom = {
        form: document.getElementById('add-entry-form'),
        nameInput: document.getElementById('entry-name'),
        urlInput: document.getElementById('entry-url'),
        usernameInput: document.getElementById('entry-username'),
        passwordInput: document.getElementById('entry-password'),
        idInput: document.getElementById('entry-id'),
        saveBtn: document.getElementById('save-btn'),
        cancelEditBtn: document.getElementById('cancel-edit-btn'),
        list: document.getElementById('entries-list'),
        emptyMsg: document.getElementById('empty-list-msg'),
        searchInput: document.getElementById('search-input'),
        exportBtn: document.getElementById('export-btn'),
        importBtn: document.getElementById('import-btn'),
        importFileInput: document.getElementById('import-file-input'),
    };

    // --- State ---
    let entries = [];
    const STORAGE_KEY = 'simplePasswordManagerEntries';

    // --- Core Functions ---
    const loadEntries = () => {
        const data = localStorage.getItem(STORAGE_KEY);
        entries = data ? JSON.parse(data) : [];
    };

    const saveEntries = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    };

    const renderEntries = () => {
        const searchTerm = dom.searchInput.value.toLowerCase();
        const filteredEntries = entries.filter(entry => 
            entry.name.toLowerCase().includes(searchTerm) || 
            entry.username.toLowerCase().includes(searchTerm)
        );

        dom.list.innerHTML = '';
        if (filteredEntries.length === 0) {
            dom.emptyMsg.style.display = 'block';
        } else {
            dom.emptyMsg.style.display = 'none';
            filteredEntries.forEach(entry => {
                const li = document.createElement('li');
                li.className = 'entry-item';
                li.dataset.id = entry.id;

                li.innerHTML = `
                    <div class="entry-details">
                        <div class="entry-name">
                            ${entry.name}
                            ${entry.url ? `<a href="${entry.url}" target="_blank" title="${entry.url}">🔗</a>` : ''}
                        </div>
                        <div class="entry-account-info">
                            <span class="entry-username">${entry.username}</span>
                            <span class="entry-password" data-password="${entry.password}">••••••••</span>
                        </div>
                    </div>
                    <div class="entry-actions">
                        <button class="copy-user-btn" title="复制账号"><svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg></button>
                        <button class="copy-pass-btn" title="复制密码"><svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg></button>
                        <button class="toggle-vis-btn" title="显示/隐藏密码"><svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></button>
                        <button class="edit-btn" title="编辑"><svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg></button>
                        <button class="delete-btn" title="删除"><svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.033C6.91 2.75 6 3.704 6 4.884v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>
                    </div>
                `;
                dom.list.appendChild(li);
            });
        }
    };

    const resetForm = () => {
        dom.form.reset();
        dom.idInput.value = '';
        dom.saveBtn.textContent = '保存';
        dom.cancelEditBtn.classList.add('hidden');
    };
    
    // --- Event Handlers ---
    dom.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = dom.idInput.value;
        const entry = {
            id: id ? parseInt(id) : Date.now(),
            name: dom.nameInput.value.trim(),
            url: dom.urlInput.value.trim(),
            username: dom.usernameInput.value.trim(),
            password: dom.passwordInput.value.trim(),
        };
        if (!entry.name || !entry.username || !entry.password) {
            alert('网站/平台、账号和密码不能为空！');
            return;
        }

        if (id) { // Edit mode
            const index = entries.findIndex(item => item.id === entry.id);
            entries[index] = entry;
        } else { // Add mode
            entries.unshift(entry);
        }
        
        saveEntries();
        renderEntries();
        resetForm();
    });

    dom.cancelEditBtn.addEventListener('click', resetForm);

    dom.list.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        const itemEl = e.target.closest('.entry-item');
        const id = parseInt(itemEl.dataset.id);
        const entry = entries.find(item => item.id === id);

        if (target.matches('.copy-user-btn')) {
            navigator.clipboard.writeText(entry.username).then(() => alert('账号已复制！'));
        } else if (target.matches('.copy-pass-btn')) {
            navigator.clipboard.writeText(entry.password).then(() => alert('密码已复制！'));
        } else if (target.matches('.toggle-vis-btn')) {
            const passEl = itemEl.querySelector('.entry-password');
            if (passEl.textContent === '••••••••') {
                passEl.textContent = entry.password;
            } else {
                passEl.textContent = '••••••••';
            }
        } else if (target.matches('.edit-btn')) {
            dom.idInput.value = entry.id;
            dom.nameInput.value = entry.name;
            dom.urlInput.value = entry.url;
            dom.usernameInput.value = entry.username;
            dom.passwordInput.value = entry.password;
            dom.saveBtn.textContent = '更新';
            dom.cancelEditBtn.classList.remove('hidden');
            window.scrollTo(0, 0);
            dom.nameInput.focus();
        } else if (target.matches('.delete-btn')) {
            if (confirm(`确定要删除 "${entry.name}" 吗？`)) {
                entries = entries.filter(item => item.id !== id);
                saveEntries();
                renderEntries();
            }
        }
    });

    dom.searchInput.addEventListener('input', renderEntries);
    
    dom.exportBtn.addEventListener('click', () => {
        if (entries.length === 0) { alert('没有数据可导出。'); return; }
        const dataStr = JSON.stringify(entries, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `password-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });

    dom.importBtn.addEventListener('click', () => dom.importFileInput.click());
    dom.importFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                if (!Array.isArray(importedData)) throw new Error('文件格式不正确。');
                if (confirm('确定要导入数据吗？这将覆盖所有现有条目！')) {
                    entries = importedData;
                    saveEntries();
                    renderEntries();
                    alert('数据导入成功！');
                }
            } catch (err) { alert('导入失败：' + err.message); }
            dom.importFileInput.value = '';
        };
        reader.readAsText(file);
    });

    // --- Initial Load ---
    loadEntries();
    renderEntries();
});