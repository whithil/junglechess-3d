// Funções UI do Smartphone em Global Scope
        let lastUserSelectedTabId = 'tab-manual'; // Default para E-book
        let isChatAutoOpened = false;
        let hasLoggedFirstMove = false; // Controle da primeira jogada para transição E-book -> Diário

        function togglePhone() {
            const phone = document.getElementById('smartphone');
            const icon = document.getElementById('phone-toggle-icon');
            if (phone.classList.contains('closed')) {
                phone.classList.remove('closed');
                icon.innerText = '▲';
            } else {
                phone.classList.add('closed');
                icon.innerText = '▼';
            }
        }

        // Adicionado parâmetro isManual para rastrear o histórico do usuário
        function openPhoneTab(tabId, btn, isManual = true) {
            document.querySelectorAll('.phone-content').forEach(c => c.classList.remove('active'));
            document.querySelectorAll('.phone-tab').forEach(b => b.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            btn.classList.add('active');

            if (isManual) {
                lastUserSelectedTabId = tabId;
                isChatAutoOpened = false; // Usuário tomou controle manual
            }
        }

        // Força a aba do Chat a abrir automaticamente
        function autoOpenChat() {
            const activeTab = document.querySelector('.phone-content.active');
            if (activeTab && activeTab.id !== 'tab-chat') {
                const tabBtnChat = document.querySelectorAll('.phone-tab')[1];
                openPhoneTab('tab-chat', tabBtnChat, false);
                isChatAutoOpened = true; // Marca que foi aberto pelo sistema
            }

            const phone = document.getElementById('smartphone');
            if (phone.classList.contains('closed')) {
                phone.classList.remove('closed');
                document.getElementById('phone-toggle-icon').innerText = '▲';
            }
        }

        // Reverte para a aba que o usuário estava usando antes
        function revertFromAutoChat() {
            if (isChatAutoOpened) {
                const tabs = document.querySelectorAll('.phone-tab');
                let targetBtn = tabs[0]; // default: tab-log
                if (lastUserSelectedTabId === 'tab-manual') targetBtn = tabs[2];
                if (lastUserSelectedTabId === 'tab-chat') targetBtn = tabs[1];

                openPhoneTab(lastUserSelectedTabId, targetBtn, false);
                isChatAutoOpened = false;
            }
        }
