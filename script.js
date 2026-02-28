// ============================
// PROSEGUR PORTAL - JAVASCRIPT
// ============================

document.addEventListener('DOMContentLoaded', () => {

    // ---- STATE ----
    let userFormCount = 1;

    // ---- ELEMENTS ----
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabs = document.querySelectorAll('.tab-content');
    const heroTitle = document.getElementById('heroTitle');
    const heroDesc = document.getElementById('heroDesc');
    const formsContainer = document.getElementById('formsContainer');
    const btnAddUser = document.getElementById('btnAddUser');
    const btnCopyCadastro = document.getElementById('btnCopyCadastro');

    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');

    const heroData = {
        cadastro: { title: 'Cadastro de Usuário' },
        manuais: { title: 'Manuais' },
        scripts: { title: 'Scripts WhatsApp' }
    };

    // ---- NAVIGATION ----
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            tabs.forEach(t => t.classList.remove('active'));
            document.getElementById(`tab-${tab}`).classList.add('active');
            heroTitle.textContent = heroData[tab].title;
            mainNav.classList.remove('open');
        });
    });

    // Mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('open');
    });

    // ---- TOGGLE BUTTONS ----
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('toggle-btn')) {
            const group = e.target.closest('.toggle-group');
            group.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Handle senha visibility
            if (e.target.dataset.field === 'senha') {
                const form = e.target.closest('.user-form');
                const senhaField = form.querySelector('.senha-field');
                if (e.target.dataset.value === 'sem') {
                    senhaField.classList.add('hidden');
                } else {
                    senhaField.classList.remove('hidden');
                }
            }

            // Handle Supervisor: always force com senha
            if (e.target.dataset.field === 'funcao') {
                const form = e.target.closest('.user-form');
                if (e.target.dataset.value === 'Supervisor(a)') {
                    const senhaGroup = form.querySelectorAll('[data-field="senha"]');
                    senhaGroup.forEach(b => b.classList.remove('active'));
                    const comBtn = form.querySelector('[data-field="senha"][data-value="com"]');
                    if (comBtn) comBtn.classList.add('active');
                    form.querySelector('.senha-field').classList.remove('hidden');
                }
            }

            // Handle Manual_25 protocolo visibility
            if (e.target.dataset.mfield === 'canal25') {
                const card = e.target.closest('.manual-card');
                const protocoloField = card.querySelector('.protocolo-field-25');
                if (e.target.dataset.value === 'WhatsApp') {
                    protocoloField.classList.remove('hidden');
                } else {
                    protocoloField.classList.add('hidden');
                }
            }
        }
    });

    // ---- AUTO-CALC DIFERENÇA (MANUAL 03) ----
    function parseCurrencyValue(value) {
        if (!value) return 0;
        let cleaned = value.replace(/[^\d.,]/g, '');
        if (cleaned.includes(',') && cleaned.includes('.')) {
            cleaned = cleaned.replace(/\./g, '').replace(',', '.');
        } else if (cleaned.includes(',')) {
            cleaned = cleaned.replace(',', '.');
        }
        const num = parseFloat(cleaned);
        return isNaN(num) ? 0 : num;
    }

    function calcularDiferenca(card) {
        const depositado = parseCurrencyValue(card.querySelector('[data-mfield="valorDepositado"]')?.value || '');
        const contabilizado = parseCurrencyValue(card.querySelector('[data-mfield="valorContabilizado"]')?.value || '');
        const diferenca = depositado - contabilizado;
        const diferencaField = card.querySelector('[data-mfield="valorDiferenca"]');
        if (diferencaField) {
            diferencaField.value = diferenca !== 0 ? diferenca.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$\u00a0', 'R$').replace('R$ ', 'R$') : '';
        }
    }

    document.addEventListener('input', (e) => {
        if (e.target.dataset.mfield === 'valorDepositado' || e.target.dataset.mfield === 'valorContabilizado') {
            const card = e.target.closest('.manual-card');
            if (card && card.dataset.manual === 'manual_03') {
                calcularDiferenca(card);
            }
        }
    });

    // ---- CNPJ AUTO-FORMATTING ----
    function formatCnpj(value) {
        // Remove tudo que não for número
        const digits = value.replace(/\D/g, '').substring(0, 14);
        let formatted = digits;
        if (digits.length > 2) formatted = digits.substring(0, 2) + '.' + digits.substring(2);
        if (digits.length > 5) formatted = digits.substring(0, 2) + '.' + digits.substring(2, 5) + '.' + digits.substring(5);
        if (digits.length > 8) formatted = digits.substring(0, 2) + '.' + digits.substring(2, 5) + '.' + digits.substring(5, 8) + '/' + digits.substring(8);
        if (digits.length > 12) formatted = digits.substring(0, 2) + '.' + digits.substring(2, 5) + '.' + digits.substring(5, 8) + '/' + digits.substring(8, 12) + '-' + digits.substring(12);
        return formatted;
    }

    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('cnpj-input')) {
            const cursorPos = e.target.selectionStart;
            const oldValue = e.target.value;
            const formatted = formatCnpj(oldValue);
            e.target.value = formatted;
            // Ajustar posição do cursor
            const diff = formatted.length - oldValue.length;
            e.target.setSelectionRange(cursorPos + diff, cursorPos + diff);
        }
    });

    // ---- ADD USER FORM ----
    btnAddUser.addEventListener('click', () => {
        userFormCount++;
        const formHTML = createUserFormHTML(userFormCount);
        formsContainer.insertAdjacentHTML('beforeend', formHTML);
        const newForm = formsContainer.lastElementChild;
        newForm.style.opacity = '0';
        newForm.style.transform = 'translateY(10px)';
        requestAnimationFrame(() => {
            newForm.style.transition = 'all 0.15s ease-out';
            newForm.style.opacity = '1';
            newForm.style.transform = 'translateY(0)';
        });
        newForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    function createUserFormHTML(index) {
        return `
        <div class="user-form" data-index="${index - 1}">
            <div class="form-header-row">
                <span class="form-badge">Usuário ${index}</span>
                <button class="btn-remove-user" onclick="removeUserForm(this)">
                    <i class="fas fa-trash-alt"></i> Remover
                </button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label><i class="fas fa-user"></i> Nome</label>
                    <input type="text" class="input-field" placeholder="Digite o nome" data-field="nome">
                </div>
                <div class="form-group">
                    <label><i class="fas fa-user"></i> Sobrenome</label>
                    <input type="text" class="input-field" placeholder="Digite o sobrenome" data-field="sobrenome">
                </div>
                <div class="form-group">
                    <label><i class="fas fa-id-card"></i> Matrícula</label>
                    <input type="text" class="input-field" placeholder="2 a 8 dígitos" data-field="matricula" maxlength="8">
                </div>
                <div class="form-group">
                    <label><i class="fas fa-lock"></i> Senha</label>
                    <div class="toggle-group">
                        <button class="toggle-btn active" data-value="com" data-field="senha">Com Senha</button>
                        <button class="toggle-btn" data-value="sem" data-field="senha">Sem Senha</button>
                    </div>
                </div>
                <div class="form-group">
                    <label><i class="fas fa-user-tag"></i> Função</label>
                    <div class="toggle-group">
                        <button class="toggle-btn active" data-value="Depositante" data-field="funcao">Depositante</button>
                        <button class="toggle-btn" data-value="Supervisor(a)" data-field="funcao">Supervisor(a)</button>
                    </div>
                </div>
                <div class="form-group senha-field">
                    <label><i class="fas fa-key"></i> Definir Senha</label>
                    <input type="text" class="input-field" placeholder="Senha do usuário" data-field="senhaValue">
                </div>
            </div>
        </div>`;
    }

    // ---- REMOVE USER FORM ----
    window.removeUserForm = function (btn) {
        const form = btn.closest('.user-form');
        form.style.transition = 'all 0.15s ease-out';
        form.style.opacity = '0';
        form.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            form.remove();
            renumberForms();
        }, 150);
    };

    function renumberForms() {
        const forms = formsContainer.querySelectorAll('.user-form');
        forms.forEach((form, i) => {
            form.querySelector('.form-badge').textContent = `Usuário ${i + 1}`;
            form.dataset.index = i;
        });
        userFormCount = forms.length;
    }

    window.clearCadastroForm = function (btn) {
        const form = btn.closest('.user-form');
        form.querySelectorAll('input.input-field').forEach(f => f.value = '');
        // Reset toggles to defaults
        form.querySelectorAll('.toggle-group').forEach(group => {
            const btns = group.querySelectorAll('.toggle-btn');
            btns.forEach(b => b.classList.remove('active'));
            if (btns[0]) btns[0].classList.add('active');
        });
        // Show senha field by default (since "Com Senha" is first)
        const senhaField = form.querySelector('.senha-field');
        if (senhaField) senhaField.classList.remove('hidden');
        showToast('Campos limpos!');
    };

    // ---- COPY CADASTROS ----
    btnCopyCadastro.addEventListener('click', () => {
        const forms = formsContainer.querySelectorAll('.user-form');
        const lines = [];

        forms.forEach(form => {
            const nome = form.querySelector('[data-field="nome"]').value.trim();
            const sobrenome = form.querySelector('[data-field="sobrenome"]').value.trim();
            const matricula = form.querySelector('[data-field="matricula"]').value.trim();

            // Validate matrícula
            if (matricula && (matricula.length < 2 || matricula.length > 8 || !/^\d+$/.test(matricula))) {
                showToast('Matrícula deve ter de 2 a 8 dígitos numéricos!', true);
                return;
            }

            const senhaToggle = form.querySelector('.toggle-group [data-field="senha"].active');
            const comSenha = senhaToggle ? senhaToggle.dataset.value === 'com' : true;

            const funcaoToggle = form.querySelector('.toggle-group [data-field="funcao"].active');
            const funcao = funcaoToggle ? funcaoToggle.dataset.value : 'Depositante';

            const senhaValue = form.querySelector('[data-field="senhaValue"]')?.value.trim() || '';

            let line;
            if (funcao === 'Supervisor(a)') {
                line = `${nome} ${sobrenome} - Matrícula ${matricula} - Supervisor(a) - Senha: ${senhaValue}`;
            } else {
                line = `${nome} ${sobrenome} - Matrícula ${matricula} - ${funcao} ${comSenha ? 'com senha' : 'sem senha'} - Senha: ${senhaValue}`;
            }

            lines.push(line);
        });

        if (lines.length > 0) {
            copyToClipboard(lines.join('\n'));
            showToast('Cadastros copiados com sucesso!');
        }
    });

    // ---- MANUAL ACCORDION & COPY ----
    window.toggleManual = function (headerEl) {
        const card = headerEl.closest('.manual-card');
        card.classList.toggle('open');
    };

    window.clearManual = function (btn) {
        const card = btn.closest('.manual-card');
        card.querySelectorAll('input.input-field, textarea.input-field').forEach(field => {
            field.value = field.defaultValue;
        });
        card.querySelectorAll('select.input-field').forEach(sel => {
            sel.selectedIndex = 0;
        });
        showToast('Campos limpos!');
    };

    window.copyCnpj25 = function (btn) {
        const card = btn.closest('.manual-card');
        const cnpj = card.querySelector('[data-mfield="cnpj"]').value.trim();
        if (cnpj) {
            copyToClipboard(`*${cnpj}*`);
            showToast('CNPJ copiado!');
        } else {
            showToast('Preencha o CNPJ primeiro!', true);
        }
    };

    window.copyManual = function (btn) {
        const card = btn.closest('.manual-card');
        const manualId = card.dataset.manual;

        // Helper: read field value from this card
        const f = (name) => {
            const el = card.querySelector(`[data-mfield="${name}"]`);
            return el ? el.value.trim() : '';
        };

        // Template map — each manual has its exact copy format (no title)
        const templates = {
            manual_16: () => [
                '-',
                `Nome: ${f('nome')}`,
                `Contato: ${f('contato')}`,
                `CNPJ/Protocolo:*${f('cnpj')}*`,
                '-',
                `Motivo: ${f('motivo')}`,
                `E-mail: ${f('email')}`,
                '-',
                `Status: ${f('status')}`,
                `Canal de atendimento: ${f('canal')}`,
                `Direcionado para: ${f('direcionado')}`
            ],
            manual_18: () => [
                '-',
                `Nome: ${f('nome')}`,
                `Contato: ${f('contato')}`,
                '-',
                `Motivo do contato: ${f('motivo')}`,
                `Direcionado para: ${f('direcionado')}`
            ],
            manual_66: () => [
                `Nome: ${f('nome')}`,
                `Contato: ${f('contato')}`,
                `CNPJ/Protocolo: *${f('cnpj')}*`,
                '-',
                `E-mail liberação: ${f('emailLiberacao')}`,
                `Motivo: ${f('motivo')}`,
                '-',
                `Status: ${f('status')}`,
                `Direcionado para: ${f('direcionado')}`
            ],
            manual_06: () => [
                `Nome: ${f('nome')}`,
                `Contato: ${f('contato')}`,
                '-',
                `E-mail liberação: ${f('emailLiberacao')}`,
                `Motivo: ${f('motivo')}`,
                '-',
                `Status: ${f('status')}`,
                `Canal de atendimento: ${f('canal')}`,
                `Direcionado Para: ${f('direcionado')}`
            ],
            manual_24: () => [
                `Usuários chegaram ao cofre às: ${f('horarioCofre')}`,
                '-',
                `Nome no Mi Prosegur: ${f('nomeMi')}`,
                `Localizado no Mi: ${f('localizadoMi')}`,
                `Usuários criados: ${f('usuariosCriados')}`
            ],
            manual_03: () => [
                '-',
                `Nome: ${f('nome')}`,
                `Contato: ${f('contato')}`,
                `E-mail: ${f('email')}`,
                '-',
                `Valor Depositado: ${formatCurrency(f('valorDepositado'))}`,
                `Valor Contabilizado: ${formatCurrency(f('valorContabilizado'))}`,
                `Valor da Diferença: ${formatCurrency(f('valorDiferenca'))}`,
                `Data/Hora do Deposito: ${f('dataHora')}`,
                `Usuário/Matricula que depositou: ${f('usuarioMatricula')}`,
                `ID da solicitação: ${f('idSolicitacao')}`
            ],
            '31_nobreak': () => [
                `Nome: ${f('nome')}`,
                `Contato: ${f('contato')}`,
                `Motivo: ${f('motivo')}`
            ],
            manual_25: () => {
                const canalBtn = card.querySelector('.toggle-group [data-mfield="canal25"].active');
                const canal = canalBtn ? canalBtn.dataset.value : 'Telefone';
                const protocolo = f('protocolo');
                const lines = [
                    `Nome: ${f('nome')}`,
                    `Contato: ${f('contato')}`,
                    `CNPJ: *${f('cnpj')}*`,
                    '-',
                    `Motivo: ${f('motivo')}`,
                    '-',
                    `Status: ${f('status')}`,
                    `Canal de Atendimento: ${canal}`
                ];
                if (canal === 'WhatsApp' && protocolo) {
                    lines.push(`Protocolo WhatsApp: ${protocolo}`);
                }
                return lines;
            }
        };

        const templateFn = templates[manualId];
        if (!templateFn) return;

        const text = templateFn().join('\n');
        copyToClipboard(text);
        showToast('Manual copiado com sucesso!');
    };

    // ---- ATENDIMENTOS PANEL (Dynamic Chats) ----
    const TOTAL_STEPS = 5;
    let chatIdCounter = 0;
    let chats = [];
    let activeChatId = null;

    const chatSidebarList = document.getElementById('chatSidebarList');
    const chatCountBadge = document.getElementById('chatCountBadge');
    const chatMain = document.getElementById('chatMain');
    const chatNotesPanel = document.getElementById('chatNotesPanel');
    const chatNotesTextarea = document.getElementById('chatNotesTextarea');
    const btnAddChat = document.getElementById('btnAddChat');
    const btnCloseNotes = document.getElementById('btnCloseNotes');
    const btnResetChats = document.getElementById('btnResetChats');

    // Create backdrop overlay for notes
    const notesOverlay = document.createElement('div');
    notesOverlay.className = 'chat-notes-overlay';
    document.body.appendChild(notesOverlay);

    // Greeting helper based on time of day
    function getGreeting() {
        const hour = new Date().getHours();
        if (hour >= 8 && hour < 12) return 'Bom dia!';
        if (hour >= 12 && hour < 19) return 'Boa tarde!';
        return 'Boa noite!';
    }

    function getGreetingPeriod() {
        const hour = new Date().getHours();
        if (hour >= 8 && hour < 12) return 'dia';
        if (hour >= 12 && hour < 19) return 'tarde';
        return 'noite';
    }

    // Step definitions
    const stepDefs = [
        { icon: 'fa-handshake', label: 'Saudação', get text() { return `${getGreeting()} Meu nome é Daniel e estou aqui para ajudá-lo(a). Com quem estou falando, por gentileza?`; } },
        {
            icon: 'fa-id-card', label: 'Motivo do contato', html: `<div class="step-select-wrapper">
            <label class="step-select-label">Selecione o motivo do contato:</label>
            <div class="step-select-container">
                <select class="step-select" id="motivoSelect">
                    <option value="" disabled selected>Escolha uma opção...</option>
                    <option value="Cadastro">Cadastro</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Diversos">Diversos</option>
                    <option value="Valores">Valores</option>
                    <option value="Abastecimento">Abastecimento</option>
                </select>
                <i class="fas fa-chevron-down step-select-icon"></i>
            </div>
        </div>` },
        { icon: 'fa-comment-dots', label: 'Identificação', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate.' },
        { icon: 'fa-cogs', label: 'Procedimento', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident.' },
        { icon: 'fa-check-circle', label: 'Encerramento', get text() { return `Foi um prazer te atender, segue o protocolo do nosso atendimento: . Tenha um ótimo ${getGreetingPeriod()}!`; } }
    ];

    // Cadastro sub-flow scripts
    const cadastroScripts = {
        cadastro_script: {
            icon: 'fa-clipboard-list',
            label: 'Script de Cadastro',
            text: 'Me informe, por gentileza os dados abaixo para cadastro: \n\nNome: \nSobrenome: \nMatrícula (Não pode começar com zero; mínimo de 2 dígito e máximo de 8 dígitos): \nPerfil do usuário depositante ou supervisor: \nCaso seja depositante, será com senha ou sem senha?',
            nextQuestion: 'Cadastro realizado?',
            yesState: 'devolutiva_cadastro',
            noState: 'cadastro_nao_atualizado'
        },
        devolutiva_cadastro: {
            icon: 'fa-check-double',
            label: 'Devolutiva Cadastro',
            text: 'Obrigado por ter aguardado.  \n\nO cadastro do(s) usuário(s) foi realizado com sucesso.  \nPeço por gentileza que realize o teste, segue os dados: ',
            nextQuestion: 'Atendimento finalizado?',
            yesState: 'finalizado_script',
            noState: 'voltar_motivo'
        },
        cadastro_nao_atualizado: {
            icon: 'fa-clock',
            label: 'Cadastro Não Atualizado',
            text: 'Obrigado por aguardar, os cadastros foram realizados, porém ainda não subiram para o seu cofre, sendo necessário o teste no período de 24 horas, caso após o prazo permaneça sem funcionar você pode retornar o contato.',
            nextQuestion: 'Atendimento finalizado?',
            yesState: 'finalizado_script',
            noState: 'voltar_motivo'
        },
        finalizado_script: {
            icon: 'fa-flag-checkered',
            label: 'Encerramento',
            get text() { return `Foi um prazer te atender, segue o protocolo do nosso atendimento: . Tenha um ótimo ${getGreetingPeriod()}!`; },
            nextQuestion: null,
            yesState: null,
            noState: null
        }
    };

    function createChat() {
        chatIdCounter++;
        const chat = {
            id: chatIdCounter,
            number: chats.length + 1,
            currentStep: 0,
            notes: '',
            flowState: null,      // null = normal step flow, string = cadastro sub-flow state
            motivoContato: null,  // stores selected motivo
            cadastrosRealizados: '', // stores pasted cadastros for devolutiva
            clientName: '',
            clientCnpj: '',
            clientPhone: ''
        };
        chats.push(chat);
        return chat;
    }

    function removeChat(chatId) {
        if (chats.length <= 1) return;
        chats = chats.filter(c => c.id !== chatId);
        // Renumber
        chats.forEach((c, i) => c.number = i + 1);
        if (activeChatId === chatId) {
            activeChatId = chats[0].id;
        }
        renderSidebar();
        renderActiveCard();
        closeNotes();
    }

    function switchToChat(chatId) {
        // Save current notes
        saveCurrentNotes();
        activeChatId = chatId;
        renderSidebar();
        renderActiveCard();
        // Load notes for new chat
        loadNotesForActiveChat();
    }

    function saveCurrentNotes() {
        if (activeChatId === null) return;
        const chat = chats.find(c => c.id === activeChatId);
        if (chat) {
            chat.notes = chatNotesTextarea.value;
        }
    }

    function loadNotesForActiveChat() {
        const chat = chats.find(c => c.id === activeChatId);
        chatNotesTextarea.value = chat ? chat.notes : '';
    }

    function renderSidebar() {
        chatCountBadge.textContent = chats.length;
        chatSidebarList.innerHTML = '';
        chats.forEach(chat => {
            const item = document.createElement('div');
            item.className = 'chat-sidebar-item' + (chat.id === activeChatId ? ' active' : '');
            item.dataset.chatId = chat.id;
            const padded = String(chat.number).padStart(2, '0');

            let removeBtn = '';
            if (chats.length > 1) {
                removeBtn = `<button class="chat-sidebar-item-remove" data-remove-chat="${chat.id}" title="Remover chat"><i class="fas fa-times"></i></button>`;
            }

            const displayName = chat.clientName.trim() || `Atendimento ${chat.number}`;
            item.innerHTML = `
                <span class="chat-sidebar-item-badge">${padded}</span>
                <div class="chat-sidebar-item-info">
                    <div class="chat-sidebar-item-name">${escapeHTML(displayName)}</div>
                    <div class="chat-sidebar-item-step">Etapa ${chat.currentStep + 1}/${TOTAL_STEPS}</div>
                </div>
                ${removeBtn}
            `;
            chatSidebarList.appendChild(item);
        });
    }

    // Shared header builder for atendimento cards
    function buildCardHeader(chat, padded, hasNotes, extraBadge) {
        const stepOrBadge = extraBadge || `<span class="atendimento-step-indicator">Etapa <span class="step-current">${chat.currentStep + 1}</span>/${TOTAL_STEPS}</span>`;
        return `
            <div class="atendimento-header">
                <div class="atendimento-title">
                    <span class="atendimento-badge">${padded}</span>
                    <input type="text" class="client-name-input" id="clientNameInput"
                        placeholder="Nome do cliente"
                        value="${escapeHTML(chat.clientName)}" />
                </div>
                <div class="atendimento-header-actions">
                    ${stepOrBadge}
                    <button class="btn-notes-toggle ${hasNotes ? 'has-notes' : ''}" id="btnNotesToggle" title="Anotações">
                        <i class="fas fa-sticky-note"></i>
                    </button>
                </div>
            </div>
            <div class="client-info-row">
                <div class="client-info-field">
                    <i class="fas fa-building"></i>
                    <input type="text" class="client-info-input" id="clientCnpjInput"
                        placeholder="CNPJ" value="${escapeHTML(chat.clientCnpj)}" />
                </div>
                <div class="client-info-field">
                    <i class="fas fa-phone"></i>
                    <input type="text" class="client-info-input" id="clientPhoneInput"
                        placeholder="Telefone" value="${escapeHTML(chat.clientPhone)}" />
                </div>
            </div>`;
    }

    function attachClientFieldListeners(chat) {
        const nameInput = chatMain.querySelector('#clientNameInput');
        const cnpjInput = chatMain.querySelector('#clientCnpjInput');
        const phoneInput = chatMain.querySelector('#clientPhoneInput');

        if (nameInput) {
            nameInput.addEventListener('input', () => {
                chat.clientName = nameInput.value;
                // Update sidebar
                const sidebarItem = chatSidebarList.querySelector(`[data-chat-id="${chat.id}"]`);
                if (sidebarItem) {
                    const nameEl = sidebarItem.querySelector('.chat-sidebar-item-name');
                    if (nameEl) nameEl.textContent = chat.clientName.trim() || `Atendimento ${chat.number}`;
                }
            });
        }
        if (cnpjInput) {
            cnpjInput.addEventListener('input', () => { chat.clientCnpj = cnpjInput.value; });
        }
        if (phoneInput) {
            phoneInput.addEventListener('input', () => { chat.clientPhone = phoneInput.value; });
        }
    }

    function renderActiveCard() {
        const chat = chats.find(c => c.id === activeChatId);
        if (!chat) {
            chatMain.innerHTML = `<div class="chat-empty-state"><i class="fab fa-whatsapp"></i><p>Nenhum chat ativo</p></div>`;
            return;
        }

        const padded = String(chat.number).padStart(2, '0');
        const hasNotes = chat.notes && chat.notes.trim().length > 0;

        // Check if we are in a sub-flow
        if (chat.flowState && cadastroScripts[chat.flowState]) {
            renderFlowCard(chat, padded, hasNotes);
            return;
        }

        let stepsHTML = '';
        stepDefs.forEach((s, i) => {
            const content = s.html ? s.html : `<p>${s.text}</p>`;
            stepsHTML += `
                <div class="atendimento-step" data-step="${i}">
                    <div class="step-label"><i class="fas ${s.icon}"></i> ${s.label}</div>
                    <div class="step-text">${content}</div>
                </div>`;
        });

        let dotsHTML = '';
        for (let i = 0; i < TOTAL_STEPS; i++) {
            dotsHTML += `<span class="progress-dot" data-step="${i}"></span>`;
        }

        chatMain.innerHTML = `
            <div class="atendimento-card" data-chat-id="${chat.id}">
                ${buildCardHeader(chat, padded, hasNotes)}
                <div class="atendimento-progress">
                    <div class="atendimento-progress-bar" style="width: ${((chat.currentStep + 1) / TOTAL_STEPS) * 100}%;"></div>
                    <div class="atendimento-progress-labels">${dotsHTML}</div>
                </div>
                <div class="atendimento-slider-container">
                    <div class="atendimento-slider" style="transform: translateX(-${chat.currentStep * 20}%);">
                        ${stepsHTML}
                    </div>
                </div>
                <div class="atendimento-footer">
                    <button class="btn atendimento-nav-btn atendimento-prev" ${chat.currentStep === 0 ? 'disabled' : ''}><i class="fas fa-arrow-left"></i> Voltar</button>
                    <button class="btn btn-copy atendimento-copy-btn"><i class="fas fa-copy"></i> Copiar</button>
                    <button class="btn atendimento-nav-btn atendimento-next" ${chat.currentStep === TOTAL_STEPS - 1 ? 'disabled' : ''}>Próxima <i class="fas fa-arrow-right"></i></button>
                </div>
            </div>
        `;

        // Update dots
        updateCardDots(chat.currentStep);
        attachClientFieldListeners(chat);
    }

    function renderFlowCard(chat, padded, hasNotes) {
        const flowDef = cadastroScripts[chat.flowState];
        if (!flowDef) return;

        // Format script text preserving line breaks
        const formattedText = escapeHTML(flowDef.text).replace(/\n/g, '<br>');

        let decisionHTML = '';
        if (flowDef.nextQuestion) {
            decisionHTML = `
                <div class="flow-decision">
                    <div class="flow-decision-label"><i class="fas fa-question-circle"></i> ${flowDef.nextQuestion}</div>
                    <div class="flow-decision-btns">
                        <button class="btn flow-btn flow-btn-yes" data-flow-action="yes">
                            <i class="fas fa-check"></i> Sim
                        </button>
                        <button class="btn flow-btn flow-btn-no" data-flow-action="no">
                            <i class="fas fa-times"></i> Não
                        </button>
                    </div>
                </div>`;
        } else {
            // Final state — show "Novo atendimento" option
            decisionHTML = `
                <div class="flow-decision">
                    <div class="flow-final-msg"><i class="fas fa-check-circle"></i> Atendimento concluído</div>
                </div>`;
        }

        chatMain.innerHTML = `
            <div class="atendimento-card flow-active" data-chat-id="${chat.id}">
                ${buildCardHeader(chat, padded, hasNotes, `<span class="flow-state-badge"><i class="fas ${flowDef.icon}"></i> ${flowDef.label}</span>`)}
                <div class="flow-content">
                    <div class="flow-script-block">
                        <div class="flow-script-header">
                            <span class="flow-script-tag"><i class="fas fa-scroll"></i> Script</span>
                            <button class="btn btn-copy flow-copy-btn" data-flow-copy>
                                <i class="fas fa-copy"></i> Copiar
                            </button>
                        </div>
                        <div class="flow-script-text">${formattedText}</div>
                    </div>
                    ${chat.flowState === 'devolutiva_cadastro' ? `
                    <div class="flow-cadastros-field">
                        <label class="flow-cadastros-label"><i class="fas fa-users"></i> Cadastros realizados</label>
                        <textarea class="flow-cadastros-textarea" id="flowCadastrosTextarea" placeholder="Cole aqui os cadastros realizados..." rows="4">${escapeHTML(chat.cadastrosRealizados)}</textarea>
                    </div>` : ''}
                    ${decisionHTML}
                </div>
            </div>
        `;

        // Auto-save cadastros textarea
        const cadastrosTextarea = chatMain.querySelector('#flowCadastrosTextarea');
        if (cadastrosTextarea) {
            cadastrosTextarea.addEventListener('input', () => {
                chat.cadastrosRealizados = cadastrosTextarea.value;
            });
        }
        attachClientFieldListeners(chat);
    }

    function updateCardDots(step) {
        const card = chatMain.querySelector('.atendimento-card');
        if (!card) return;
        const dots = card.querySelectorAll('.progress-dot');
        dots.forEach((dot, i) => {
            dot.classList.remove('active', 'completed');
            if (i < step) dot.classList.add('completed');
            if (i === step) dot.classList.add('active');
        });
    }

    function updateCardUI(chat) {
        const card = chatMain.querySelector('.atendimento-card');
        if (!card) return;

        const slider = card.querySelector('.atendimento-slider');
        const progressBar = card.querySelector('.atendimento-progress-bar');
        const stepIndicator = card.querySelector('.step-current');
        const prevBtn = card.querySelector('.atendimento-prev');
        const nextBtn = card.querySelector('.atendimento-next');

        slider.style.transform = `translateX(-${chat.currentStep * 20}%)`;
        progressBar.style.width = `${((chat.currentStep + 1) / TOTAL_STEPS) * 100}%`;
        stepIndicator.textContent = chat.currentStep + 1;
        prevBtn.disabled = chat.currentStep === 0;
        nextBtn.disabled = chat.currentStep === TOTAL_STEPS - 1;
        updateCardDots(chat.currentStep);

        // Update sidebar step info
        const sidebarItem = chatSidebarList.querySelector(`[data-chat-id="${chat.id}"]`);
        if (sidebarItem) {
            const stepEl = sidebarItem.querySelector('.chat-sidebar-item-step');
            if (stepEl) stepEl.textContent = `Etapa ${chat.currentStep + 1}/${TOTAL_STEPS}`;
        }
    }

    function openNotes() {
        loadNotesForActiveChat();
        chatNotesPanel.classList.add('open');
        notesOverlay.classList.add('open');
    }

    function closeNotes() {
        saveCurrentNotes();
        chatNotesPanel.classList.remove('open');
        notesOverlay.classList.remove('open');
        // Update notes button indicator
        const notesBtn = chatMain.querySelector('#btnNotesToggle');
        const chat = chats.find(c => c.id === activeChatId);
        if (notesBtn && chat) {
            if (chat.notes && chat.notes.trim().length > 0) {
                notesBtn.classList.add('has-notes');
            } else {
                notesBtn.classList.remove('has-notes');
            }
        }
    }

    // --- Event Listeners ---
    btnAddChat.addEventListener('click', () => {
        saveCurrentNotes();
        const chat = createChat();
        activeChatId = chat.id;
        renderSidebar();
        renderActiveCard();
        showToast(`Atendimento ${chat.number} criado!`);
    });

    btnCloseNotes.addEventListener('click', closeNotes);
    notesOverlay.addEventListener('click', closeNotes);

    // Reset all chats
    btnResetChats.addEventListener('click', () => {
        closeNotes();
        chats = [];
        chatIdCounter = 0;
        activeChatId = null;
        const firstChat = createChat();
        activeChatId = firstChat.id;
        renderSidebar();
        renderActiveCard();
        showToast('Chats resetados!');
    });

    // Sidebar click delegation
    chatSidebarList.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('[data-remove-chat]');
        if (removeBtn) {
            const chatId = parseInt(removeBtn.dataset.removeChat);
            removeChat(chatId);
            showToast('Chat removido!');
            return;
        }
        const item = e.target.closest('.chat-sidebar-item');
        if (item) {
            const chatId = parseInt(item.dataset.chatId);
            if (chatId !== activeChatId) {
                closeNotes();
                switchToChat(chatId);
            }
        }
    });

    // Card button delegation (prev/next/copy/notes)
    chatMain.addEventListener('click', (e) => {
        const chat = chats.find(c => c.id === activeChatId);
        if (!chat) return;

        const notesBtn = e.target.closest('#btnNotesToggle');
        if (notesBtn) {
            if (chatNotesPanel.classList.contains('open')) {
                closeNotes();
            } else {
                openNotes();
            }
            return;
        }

        // --- Sub-flow handlers ---
        const flowCopyBtn = e.target.closest('[data-flow-copy]');
        if (flowCopyBtn && chat.flowState && cadastroScripts[chat.flowState]) {
            let scriptText = cadastroScripts[chat.flowState].text;
            // Append cadastros data for devolutiva
            if (chat.flowState === 'devolutiva_cadastro' && chat.cadastrosRealizados.trim()) {
                scriptText += '\n' + chat.cadastrosRealizados.trim();
            }
            copyToClipboard(scriptText);
            showToast('Script copiado com sucesso!');
            return;
        }

        const flowActionBtn = e.target.closest('[data-flow-action]');
        if (flowActionBtn && chat.flowState) {
            const action = flowActionBtn.dataset.flowAction;
            const flowDef = cadastroScripts[chat.flowState];
            if (!flowDef) return;

            if (action === 'yes') {
                if (flowDef.yesState === 'finalizado_script') {
                    chat.flowState = 'finalizado_script';
                } else {
                    chat.flowState = flowDef.yesState;
                }
            } else if (action === 'no') {
                if (flowDef.noState === 'voltar_motivo') {
                    // Reset back to step 2 (motivo do contato)
                    chat.flowState = null;
                    chat.motivoContato = null;
                    chat.currentStep = 1;
                    renderActiveCard();
                    return;
                } else {
                    chat.flowState = flowDef.noState;
                }
            }
            renderActiveCard();
            return;
        }

        // --- Normal step handlers ---
        const nextBtn = e.target.closest('.atendimento-next');
        const prevBtn = e.target.closest('.atendimento-prev');
        const copyBtn = e.target.closest('.atendimento-copy-btn');

        if (nextBtn && chat.currentStep < TOTAL_STEPS - 1) {
            // If on step 2 (motivo do contato), check if Cadastro is selected
            if (chat.currentStep === 1) {
                const motivoSelect = chatMain.querySelector('#motivoSelect');
                if (motivoSelect && motivoSelect.value === 'Cadastro') {
                    chat.motivoContato = 'Cadastro';
                    chat.flowState = 'cadastro_script';
                    renderActiveCard();
                    return;
                }
            }
            chat.currentStep++;
            updateCardUI(chat);
        }

        if (prevBtn && chat.currentStep > 0) {
            chat.currentStep--;
            updateCardUI(chat);
        }

        if (copyBtn) {
            const card = chatMain.querySelector('.atendimento-card');
            const steps = card.querySelectorAll('.atendimento-step');
            const currentStep = steps[chat.currentStep];
            if (currentStep) {
                const text = currentStep.querySelector('.step-text').textContent.trim();
                copyToClipboard(text);
                showToast('Script copiado com sucesso!');
            }
        }
    });

    // Initialize with 1 chat
    const firstChat = createChat();
    activeChatId = firstChat.id;
    renderSidebar();
    renderActiveCard();

    // ---- COPIAR VALORES (MANUAL 03) ----
    window.copyValores03 = function (btn) {
        const card = btn.closest('.manual-card');
        const fv = (name) => {
            const el = card.querySelector(`[data-mfield="${name}"]`);
            return el ? el.value.trim() : '';
        };

        const lines = [
            `Valor Depositado: ${formatCurrency(fv('valorDepositado'))}`,
            `Valor Contabilizado: ${formatCurrency(fv('valorContabilizado'))}`,
            `Valor da Diferença: ${formatCurrency(fv('valorDiferenca'))}`,
            `Data/Hora do Deposito: ${fv('dataHora')}`,
            `Usuário/Matricula que depositou: ${fv('usuarioMatricula')}`
        ];

        copyToClipboard(lines.join('\n'));
        showToast('Valores copiados com sucesso!');
    };

    // ---- UTILITIES ----
    function formatCurrency(value) {
        if (!value) return 'R$0,00';
        // Remove tudo que não for número, vírgula ou ponto
        let cleaned = value.replace(/[^\d.,]/g, '');
        // Se já tem vírgula como decimal, converte pra número
        // Trata formatos: 1234.56, 1234,56, 1.234,56, 1234
        let num;
        if (cleaned.includes(',') && cleaned.includes('.')) {
            // Formato 1.234,56 -> remove pontos, troca vírgula por ponto
            cleaned = cleaned.replace(/\./g, '').replace(',', '.');
            num = parseFloat(cleaned);
        } else if (cleaned.includes(',')) {
            // Formato 1234,56 -> troca vírgula por ponto
            cleaned = cleaned.replace(',', '.');
            num = parseFloat(cleaned);
        } else {
            num = parseFloat(cleaned);
        }
        if (isNaN(num)) return 'R$0,00';
        // Formata como moeda brasileira
        return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$\u00a0', 'R$').replace('R$ ', 'R$');
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).catch(() => {
            // Fallback
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        });
    }

    function showToast(msg, isError = false) {
        toastMsg.textContent = msg;
        toast.style.background = isError ? '#E74C3C' : '#2ECC71';
        toast.querySelector('i').className = isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }


});
