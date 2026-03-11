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
    const btnResetCadastros = document.getElementById('btnResetCadastros');

    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');

    const heroData = {
        cadastro: { title: 'Cadastro de Usuário' },
        manuais: { title: 'Manuais' },
        scripts: { title: 'Scripts WhatsApp' }
    };

    // ---- THEME TOGGLE ----
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'light') {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            themeToggleBtn.title = 'Alternar para tema escuro';
        } else {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            themeToggleBtn.title = 'Alternar para tema claro';
        }
        document.body.style.transition = 'background 0.4s ease, color 0.4s ease';
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('prosegur-theme') || 'dark';
    applyTheme(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('prosegur-theme', next);
    });

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

            // Handle Supervisor: always force com senha and hide senha toggle
            if (e.target.dataset.field === 'funcao') {
                const form = e.target.closest('.user-form');
                const senhaToggleGroup = form.querySelector('.senha-toggle-group');
                const senhaField = form.querySelector('.senha-field');
                if (e.target.dataset.value === 'Supervisor(a)') {
                    // Force "Com Senha" and hide the toggle since Supervisor always has password
                    const senhaGroup = form.querySelectorAll('[data-field="senha"]');
                    senhaGroup.forEach(b => b.classList.remove('active'));
                    const comBtn = form.querySelector('[data-field="senha"][data-value="com"]');
                    if (comBtn) comBtn.classList.add('active');
                    senhaToggleGroup.classList.add('hidden');
                    senhaField.classList.remove('hidden');
                } else {
                    // Depositante: show the senha toggle again
                    senhaToggleGroup.classList.remove('hidden');
                }
            }

            // Handle Manual_25 protocolo visibility

        }
    });

    // ---- NOME / SOBRENOME: ACCENT REMOVAL + SINGLE WORD RESTRICTION ----

    // Block space key entirely in nome/sobrenome fields
    document.addEventListener('keydown', (e) => {
        if (e.target.dataset.field === 'nome' || e.target.dataset.field === 'sobrenome') {
            if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
            }
        }
    });

    // On input: strip accents, enforce single word, and auto-capitalize first letter
    document.addEventListener('input', (e) => {
        if (e.target.dataset.field === 'nome' || e.target.dataset.field === 'sobrenome') {
            const cursorPos = e.target.selectionStart;
            let val = e.target.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

            // If pasted text has spaces, keep only first word
            if (val.trim().includes(' ')) {
                val = val.trim().split(/\s+/)[0];
                showNameHint(e.target);
            }

            // Auto-capitalize: first letter uppercase, rest lowercase
            if (val.length > 0) {
                val = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
            }

            if (val !== e.target.value) {
                e.target.value = val;
                const newPos = Math.min(cursorPos, val.length);
                e.target.setSelectionRange(newPos, newPos);
            }
        }
    });

    // ---- PASTE: TRIM WHITESPACE FROM NOME, SOBRENOME, MATRÍCULA ----
    document.addEventListener('paste', (e) => {
        const field = e.target.dataset.field;
        if (field === 'nome' || field === 'sobrenome' || field === 'matricula') {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const trimmed = pastedText.trim();
            // Insert trimmed text at cursor position
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const currentVal = e.target.value;
            e.target.value = currentVal.substring(0, start) + trimmed + currentVal.substring(end);
            const newPos = start + trimmed.length;
            e.target.setSelectionRange(newPos, newPos);
            // Trigger input event so other handlers (accent removal, capitalize, validation) still run
            e.target.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });

    // Show subtle inline hint below the field
    function showNameHint(input) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;

        // Don't duplicate if already showing
        let existing = formGroup.querySelector('.name-hint');
        if (existing && !existing.classList.contains('fade-out')) return;
        if (existing) existing.remove();

        const hint = document.createElement('span');
        hint.className = 'name-hint';
        hint.innerHTML = '<i class="fas fa-info-circle" style="margin-right:4px;font-size:0.7rem;"></i>Apenas um nome permitido';
        formGroup.appendChild(hint);

        // Auto-remove after 2.5s
        setTimeout(() => {
            hint.classList.add('fade-out');
            hint.addEventListener('animationend', () => hint.remove());
        }, 2500);
    }

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

    // ---- MATRÍCULA VALIDATION ----
    const validationModalOverlay = document.getElementById('validationModalOverlay');
    const validationModalMessage = document.getElementById('validationModalMessage');
    const validationModalClose = document.getElementById('validationModalClose');

    function showValidationModal(message) {
        validationModalMessage.textContent = message;
        validationModalOverlay.classList.add('active');
    }

    function hideValidationModal() {
        validationModalOverlay.classList.remove('active');
    }

    validationModalClose.addEventListener('click', hideValidationModal);
    validationModalOverlay.addEventListener('click', (e) => {
        if (e.target === validationModalOverlay) hideValidationModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && validationModalOverlay.classList.contains('active')) {
            hideValidationModal();
        }
    });

    function validateMatricula(input) {
        const value = input.value;
        if (!value) {
            input.classList.remove('input-error');
            return true;
        }

        // Check for non-numeric characters
        if (/[^\d]/.test(value)) {
            input.classList.add('input-error');
            showValidationModal('A matrícula contém caracteres inválidos. Use apenas números (0-9), sem pontuação ou letras.');
            input.value = value.replace(/[^\d]/g, '');
            return false;
        }

        // Check if starts with 0
        if (value.startsWith('0')) {
            input.classList.add('input-error');
            showValidationModal('A matrícula não pode começar com zero. O primeiro dígito deve ser de 1 a 9.');
            return false;
        }

        // Check length (1-9 digits)
        if (value.length > 9) {
            input.classList.add('input-error');
            showValidationModal('A matrícula pode ter no máximo 9 dígitos.');
            return false;
        }

        input.classList.remove('input-error');
        return true;
    }

    // Live validation on input (with guard to prevent infinite loop)
    let _isValidatingMatricula = false;
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('matricula-input')) {
            // Guard: prevent re-entrant calls when we set value programmatically
            if (_isValidatingMatricula) return;
            _isValidatingMatricula = true;

            try {
                const originalValue = e.target.value;
                const cleanedValue = originalValue.replace(/[^\d]/g, '');

                // If non-numeric characters were typed, remove them and show modal
                if (originalValue !== cleanedValue) {
                    e.target.value = cleanedValue;
                    e.target.classList.add('input-error');
                    showValidationModal('A matrícula contém caracteres inválidos. Use apenas números (0-9), sem pontuação ou letras.');
                    _isValidatingMatricula = false;
                    return;
                }

                // Check if starts with 0
                if (cleanedValue.startsWith('0')) {
                    e.target.classList.add('input-error');
                    showValidationModal('A matrícula não pode começar com zero. O primeiro dígito deve ser de 1 a 9.');
                    e.target.value = '';
                    _isValidatingMatricula = false;
                    return;
                }

                e.target.classList.remove('input-error');

                // ---- CARREFOUR 9-DIGIT CHECK ----
                if (cleanedValue.length === 9) {
                    showCarrefourConfirm(e.target);
                } else {
                    removeCarrefourConfirm(e.target);
                }
            } finally {
                _isValidatingMatricula = false;
            }
        }
    });

    // Carrefour confirmation popover
    function showCarrefourConfirm(input) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;

        // Don't duplicate
        if (formGroup.querySelector('.carrefour-confirm')) return;

        const popover = document.createElement('div');
        popover.className = 'carrefour-confirm';
        popover.innerHTML = `
            <div class="carrefour-confirm-icon">
                <i class="fas fa-store"></i>
                <span class="carrefour-confirm-text" style="margin-bottom:0;">Matrícula com 9 dígitos</span>
            </div>
            <p class="carrefour-confirm-text">Apenas clientes <strong>Carrefour</strong> podem ter matrícula com 9 dígitos. Essa matrícula é de um cliente Carrefour?</p>
            <div class="carrefour-confirm-btns">
                <button class="carrefour-btn carrefour-btn-yes" data-action="yes">
                    <i class="fas fa-check"></i> Sim, é Carrefour
                </button>
                <button class="carrefour-btn carrefour-btn-no" data-action="no">
                    <i class="fas fa-times"></i> Não
                </button>
            </div>
        `;
        formGroup.appendChild(popover);

        // Handle Yes
        popover.querySelector('[data-action="yes"]').addEventListener('click', () => {
            dismissCarrefourPopover(popover);
        });

        // Handle No — remove 9th digit
        popover.querySelector('[data-action="no"]').addEventListener('click', () => {
            input.value = input.value.substring(0, 8);
            dismissCarrefourPopover(popover);
        });
    }

    function removeCarrefourConfirm(input) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;
        const existing = formGroup.querySelector('.carrefour-confirm');
        if (existing) dismissCarrefourPopover(existing);
    }

    function dismissCarrefourPopover(popover) {
        popover.classList.add('fade-out');
        popover.addEventListener('animationend', () => popover.remove());
    }

    // Remove error state on focus
    document.addEventListener('focus', (e) => {
        if (e.target.classList.contains('matricula-input')) {
            e.target.classList.remove('input-error');
        }
    }, true);

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
                    <input type="text" class="input-field matricula-input" placeholder="1 a 9 dígitos" data-field="matricula" maxlength="9">
                </div>
                <div class="form-group senha-toggle-group">
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
        form.querySelectorAll('input.input-field').forEach(f => {
            f.value = '';
            f.classList.remove('input-error');
        });
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

    // ---- RESET ALL CADASTROS ----
    btnResetCadastros.addEventListener('click', () => {
        formsContainer.innerHTML = `
            <div class="user-form" data-index="0">
                <div class="form-header-row">
                    <span class="form-badge">Usuário 1</span>
                    <button class="btn-icon" onclick="clearCadastroForm(this)" title="Limpar campos">
                        <i class="fas fa-eraser"></i> Limpar
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
                        <input type="text" class="input-field matricula-input" placeholder="1 a 9 dígitos" data-field="matricula" maxlength="9">
                    </div>
                    <div class="form-group senha-toggle-group">
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
        userFormCount = 1;
        showToast('Cadastros resetados!');
    });

    // ---- COPY CADASTROS ----
    btnCopyCadastro.addEventListener('click', () => {
        const forms = formsContainer.querySelectorAll('.user-form');
        const lines = [];

        forms.forEach(form => {
            const nome = form.querySelector('[data-field="nome"]').value.trim();
            const sobrenome = form.querySelector('[data-field="sobrenome"]').value.trim();
            const matricula = form.querySelector('[data-field="matricula"]').value.trim();

            // Validate matrícula
            if (matricula && (!/^[1-9]\d{0,8}$/.test(matricula))) {
                const matriculaInput = form.querySelector('[data-field="matricula"]');
                if (matriculaInput) matriculaInput.classList.add('input-error');
                showValidationModal('Verifique a matrícula antes de copiar. Ela deve conter apenas números, não começar com zero e ter de 1 a 9 dígitos.');
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
            manual_16: () => {
                const canalBtn = card.querySelector('.toggle-group [data-mfield="canal16"].active');
                const canal = canalBtn ? canalBtn.dataset.value : 'Telefone';
                return [
                    '-',
                    `Nome: ${f('nome')}`,
                    `Contato: ${f('contato')}`,
                    `CNPJ/Protocolo:*${f('cnpj')}*`,
                    '-',
                    `Motivo: ${f('motivo')}`,
                    `E-mail: ${f('email')}`,
                    '-',
                    `Status: ${f('status')}`,
                    `Canal de atendimento: ${canal}`,
                    `Direcionado para: ${f('direcionado')}`
                ];
            },
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
            manual_06: () => {
                const canalBtn = card.querySelector('.toggle-group [data-mfield="canal06"].active');
                const canal = canalBtn ? canalBtn.dataset.value : 'Telefone';
                return [
                    `Nome: ${f('nome')}`,
                    `Contato: ${f('contato')}`,
                    '-',
                    `E-mail liberação: ${f('emailLiberacao')}`,
                    `Motivo: ${f('motivo')}`,
                    '-',
                    `Status: ${f('status')}`,
                    `Canal de atendimento: ${canal}`,
                    `Direcionado Para: ${f('direcionado')}`
                ];
            },
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
            manual_25: () => [
                `Motivo: ${f('motivo')}`,
                `- `,
                `Status: ${f('status')}`,
                `Canal de Atendimento: ${f('canal')}`
            ]
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
        { icon: 'fa-comment-dots', label: 'Identificação', text: 'Em desenvolvimento...' },
        { icon: 'fa-cogs', label: 'Procedimento', text: 'Em desenvolvimento...' },
        { icon: 'fa-check-circle', label: 'Encerramento', get text() { return `Foi um prazer te atender, segue o protocolo do nosso atendimento: . Tenha um ótimo ${getGreetingPeriod()}!`; } }
    ];

    // Cadastro sub-flow scripts
    const cadastroScripts = {
        cadastro_identificacao: {
            icon: 'fa-id-card',
            label: 'Identificação',
            getText(clientName) {
                const nome = clientName && clientName.trim() ? clientName.trim() : '[NOME do Atendimento]';
                return `Entendi ${nome}. Me informa o CNPJ e o nome do estabelecimento por gentileza.`;
            },
            nextQuestion: 'Prosseguir para cadastro?',
            yesState: 'cadastro_script',
            noState: null
        },
        cadastro_script: {
            icon: 'fa-clipboard-list',
            label: 'Script de Cadastro',
            text: 'Me informe, por gentileza os dados abaixo para cadastro: \n\nNome: \nSobrenome: \nMatrícula (Não pode começar com zero; mínimo de 2 dígito e máximo de 8 dígitos): \nPerfil do usuário depositante ou supervisor: \nCaso seja depositante, será com senha ou sem senha?',
            nextQuestion: 'O Cadastro atualizou ou não?',
            isCustomDecision: true,
            yesLabel: 'Atualizou',
            noLabel: 'Não atualizou',
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

    // Abastecimento sub-flow scripts
    const abastecimentoScripts = {
        abastecimento_script: {
            icon: 'fa-boxes-stacking',
            label: 'Identificação',
            getText(clientName) {
                const nome = clientName && clientName.trim() ? clientName.trim() : '[NOME do Atendimento]';
                return `Entendi ${nome}. Me informa o CNPJ e o nome do estabelecimento por gentileza.`;
            },
            hasMaterialSelect: true,
            nextQuestion: null,
            yesState: null,
            noState: null
        },
        abastecimento_boca_de_lobo: {
            icon: 'fa-question-circle',
            label: 'Tipo de Cofre',
            text: '',
            isBocaDeLoboDecision: true,
            nextQuestion: 'O cofre é Boca de Lobo?',
            yesState: 'boca_de_lobo_dados',
            noState: 'abastecimento_devolutiva'
        },
        boca_de_lobo_dados: {
            icon: 'fa-clipboard-list',
            label: 'Dados Boca de Lobo',
            text: 'Por gentileza me informe os seguintes dados:\n\nRazão social:\nLoja Filial:\nCNPJ:\nPDV Da Loja:\n\nEndereço completo:',
            nextQuestion: 'Dados informados?',
            yesState: 'boca_de_lobo_devolutiva',
            noState: null
        },
        boca_de_lobo_devolutiva: {
            icon: 'fa-check-double',
            label: 'Devolutiva Boca de Lobo',
            text: 'Obrigado pela Informações.\n\nSua solicitação já foi enviada ao setor responsável, nas próximas solicitações pode ser realizada via e-mail para a filial centralspc@prosegur.com ou no 0800 769 0031 opção 5, que cairá diretamente com o setor responsável. A entrega será realizada nas próximas coletas ao local.',
            nextQuestion: 'Atendimento finalizado?',
            yesState: 'finalizado_abastecimento',
            noState: 'voltar_motivo'
        },
        abastecimento_devolutiva: {
            icon: 'fa-check-double',
            label: 'Devolutiva',
            text: 'Sua solicitação já foi enviada ao setor responsável através do protocolo: , nas próximas solicitações pode ser realizada via e-mail para a filial centralspc@prosegur.com ou no 0800 769 0031 opção 5 que cairá diretamente com o setor responsável. A entrega será realizada nas próximas coleta ao local.',
            nextQuestion: 'Atendimento finalizado?',
            yesState: 'finalizado_abastecimento',
            noState: 'voltar_motivo'
        },
        finalizado_abastecimento: {
            icon: 'fa-flag-checkered',
            label: 'Encerramento',
            get text() { return `Foi um prazer te atender, segue o protocolo do nosso atendimento: . Tenha um ótimo ${getGreetingPeriod()}!`; },
            nextQuestion: null,
            yesState: null,
            noState: null
        }
    };

    // Valores sub-flow scripts
    const valoresScripts = {
        valores_identificacao: {
            icon: 'fa-dollar-sign',
            label: 'Identificação',
            getText(clientName) {
                const nome = clientName && clientName.trim() ? clientName.trim() : '[NOME do Atendimento]';
                return `Entendi ${nome}. Me informa o CNPJ e o nome do estabelecimento por gentileza.`;
            },
            hasValoresSelect: true,
            nextQuestion: null,
            yesState: null,
            noState: null
        },
        valores_analise_diferenca: {
            icon: 'fa-question-circle',
            label: 'Tipo de Cliente',
            text: '',
            isCustomDecision: true,
            nextQuestion: 'Cliente D+0 ou D+1?',
            yesLabel: 'D+0',
            noLabel: 'D+1',
            yesState: 'valores_d0_dados',
            noState: 'valores_d1_script'
        },
        valores_d1_script: {
            icon: 'fa-clock',
            label: 'D+1 - Modalidade',
            text: 'Verifiquei no sistema que vocês são da modalidade D+1, sendo assim, é necessário que vocês aguardem sua próxima coleta e a apuração da Tesouraria, assim que apurado o valor, será creditado em sua conta.',
            nextQuestion: 'Atendimento finalizado?',
            yesState: 'finalizado_valores',
            noState: 'voltar_motivo'
        },
        valores_d0_dados: {
            icon: 'fa-clipboard-list',
            label: 'D+0 - Dados',
            text: 'Certo, vou pedir por favor que preencha as informações abaixo:\n\nE-mail (Para a devolutiva da análise):\nValor Depositado:\nValor Contabilizado:\nValor da Diferença:\nData/Hora do Deposito:\nUsuário/Matricula que depositou:',
            nextQuestion: 'Informações preenchidas?',
            yesState: 'valores_d0_devolutiva',
            noState: null
        },
        valores_d0_devolutiva: {
            icon: 'fa-check-double',
            label: 'Devolutiva D+0',
            text: 'Sua análise foi direcionada ao setor correspondente por favor aguarde, que em breve (Análise Diferença "Cash Today") retornará com mais detalhes. Segue o protocolo da análise: ',
            nextQuestion: 'Atendimento finalizado?',
            yesState: 'finalizado_valores',
            noState: 'voltar_motivo'
        },
        finalizado_valores: {
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
            flowState: null,
            motivoContato: null,
            cadastrosRealizados: '',
            clientName: '',
            clientCnpj: '',
            clientPhone: '',
            materialAbastecimento: '',
            valoresOpcao: ''
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
                    <i class="fas fa-phone"></i>
                    <input type="text" class="client-info-input" id="clientPhoneInput"
                        placeholder="Telefone" value="${escapeHTML(chat.clientPhone)}" />
                </div>
                <div class="client-info-field">
                    <i class="fas fa-building"></i>
                    <input type="text" class="client-info-input cnpj-input" id="clientCnpjInput"
                        placeholder="CNPJ" value="${escapeHTML(chat.clientCnpj)}" />
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

    // Helper to get the active flow definition for a chat
    function getFlowDef(chat) {
        if (!chat.flowState) return null;
        if (cadastroScripts[chat.flowState]) return cadastroScripts[chat.flowState];
        if (abastecimentoScripts[chat.flowState]) return abastecimentoScripts[chat.flowState];
        if (valoresScripts[chat.flowState]) return valoresScripts[chat.flowState];
        return null;
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
        if (chat.flowState && getFlowDef(chat)) {
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
        const flowDef = getFlowDef(chat);
        if (!flowDef) return;

        // Get script text (some states use getText with clientName)
        let scriptText = '';
        if (typeof flowDef.getText === 'function') {
            scriptText = flowDef.getText(chat.clientName);
        } else {
            scriptText = flowDef.text;
        }

        // Format script text preserving line breaks
        const formattedText = escapeHTML(scriptText).replace(/\n/g, '<br>');

        // Sub-select for flows (material for abastecimento, opção for valores)
        let subSelectHTML = '';
        if (flowDef.hasMaterialSelect) {
            subSelectHTML = `
                <div class="flow-material-select">
                    <label class="step-select-label"><i class="fas fa-box-open"></i> Qual material o cliente solicitou?</label>
                    <div class="step-select-container">
                        <select class="step-select" id="flowSubSelect">
                            <option value="" disabled ${!chat.materialAbastecimento ? 'selected' : ''}>Escolha o material...</option>
                            <option value="Bobina Pequena" ${chat.materialAbastecimento === 'Bobina Pequena' ? 'selected' : ''}>Bobina Pequena</option>
                            <option value="Bobina Grande" ${chat.materialAbastecimento === 'Bobina Grande' ? 'selected' : ''}>Bobina Grande</option>
                            <option value="Malote Pequeno" ${chat.materialAbastecimento === 'Malote Pequeno' ? 'selected' : ''}>Malote Pequeno</option>
                            <option value="Malote Médio" ${chat.materialAbastecimento === 'Malote Médio' ? 'selected' : ''}>Malote Médio</option>
                            <option value="Malote Grande" ${chat.materialAbastecimento === 'Malote Grande' ? 'selected' : ''}>Malote Grande</option>
                            <option value="Envelope de Transferência" ${chat.materialAbastecimento === 'Envelope de Transferência' ? 'selected' : ''}>Envelope de Transferência</option>
                            <option value="Bananinha Transparente" ${chat.materialAbastecimento === 'Bananinha Transparente' ? 'selected' : ''}>Bananinha Transparente</option>
                            <option value="Bananinha Branca" ${chat.materialAbastecimento === 'Bananinha Branca' ? 'selected' : ''}>Bananinha Branca</option>
                        </select>
                        <i class="fas fa-chevron-down step-select-icon"></i>
                    </div>
                    <button class="btn btn-primary flow-material-confirm" id="btnFlowSubConfirm" ${!chat.materialAbastecimento ? 'disabled' : ''}>
                        <i class="fas fa-arrow-right"></i> Confirmar Material
                    </button>
                </div>`;
        } else if (flowDef.hasValoresSelect) {
            subSelectHTML = `
                <div class="flow-material-select">
                    <label class="step-select-label"><i class="fas fa-chart-line"></i> Qual a opção desejada?</label>
                    <div class="step-select-container">
                        <select class="step-select" id="flowSubSelect">
                            <option value="" disabled ${!chat.valoresOpcao ? 'selected' : ''}>Escolha uma opção...</option>
                            <option value="Análise de Diferença" ${chat.valoresOpcao === 'Análise de Diferença' ? 'selected' : ''}>Análise de Diferença</option>
                            <option value="Análise de Crédito" ${chat.valoresOpcao === 'Análise de Crédito' ? 'selected' : ''}>Análise de Crédito</option>
                            <option value="Ficheiro" ${chat.valoresOpcao === 'Ficheiro' ? 'selected' : ''}>Ficheiro</option>
                        </select>
                        <i class="fas fa-chevron-down step-select-icon"></i>
                    </div>
                    <button class="btn btn-primary flow-material-confirm" id="btnFlowSubConfirm" ${!chat.valoresOpcao ? 'disabled' : ''}>
                        <i class="fas fa-arrow-right"></i> Confirmar Opção
                    </button>
                </div>`;
        }

        let decisionHTML = '';
        if (flowDef.isCustomDecision || flowDef.isBocaDeLoboDecision) {
            // Custom-labeled decision (D+0/D+1, Boca de Lobo, etc.)
            const yesLabel = flowDef.yesLabel || 'Sim';
            const noLabel = flowDef.noLabel || 'Não';
            const yesIcon = flowDef.yesLabel ? '' : '<i class="fas fa-check"></i> ';
            const noIcon = flowDef.noLabel ? '' : '<i class="fas fa-times"></i> ';
            decisionHTML = `
                <div class="flow-decision">
                    <div class="flow-decision-label"><i class="fas fa-question-circle"></i> ${flowDef.nextQuestion}</div>
                    <div class="flow-decision-btns">
                        <button class="btn flow-btn flow-btn-yes" data-flow-action="yes">
                            ${yesIcon}${yesLabel}
                        </button>
                        <button class="btn flow-btn flow-btn-no" data-flow-action="no">
                            ${noIcon}${noLabel}
                        </button>
                    </div>
                </div>`;
        } else if (flowDef.nextQuestion) {
            decisionHTML = `
                <div class="flow-decision">
                    <div class="flow-decision-label"><i class="fas fa-question-circle"></i> ${flowDef.nextQuestion}</div>
                    <div class="flow-decision-btns">
                        <button class="btn flow-btn flow-btn-yes" data-flow-action="yes">
                            <i class="fas fa-check"></i> Sim
                        </button>
                        ${flowDef.noState ? `<button class="btn flow-btn flow-btn-no" data-flow-action="no">
                            <i class="fas fa-times"></i> Não
                        </button>` : ''}
                    </div>
                </div>`;
        } else if (!flowDef.hasMaterialSelect && !flowDef.hasValoresSelect) {
            // Final state — show "Atendimento concluído"
            decisionHTML = `
                <div class="flow-decision">
                    <div class="flow-final-msg"><i class="fas fa-check-circle"></i> Atendimento concluído</div>
                </div>`;
        }

        // Hide script block only for states with no actual text content
        const showScriptBlock = scriptText && scriptText.trim().length > 0;

        chatMain.innerHTML = `
            <div class="atendimento-card flow-active" data-chat-id="${chat.id}">
                ${buildCardHeader(chat, padded, hasNotes, `<span class="flow-state-badge"><i class="fas ${flowDef.icon}"></i> ${flowDef.label}</span>`)}
                <div class="flow-content">
                    ${showScriptBlock ? `
                    <div class="flow-script-block">
                        <div class="flow-script-header">
                            <span class="flow-script-tag"><i class="fas fa-scroll"></i> Script</span>
                            <button class="btn btn-copy flow-copy-btn" data-flow-copy>
                                <i class="fas fa-copy"></i> Copiar
                            </button>
                        </div>
                        <div class="flow-script-text">${formattedText}</div>
                    </div>` : ''}
                    ${subSelectHTML}
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

        // Sub-select listeners (material / valores)
        const flowSubSelect = chatMain.querySelector('#flowSubSelect');
        const flowSubConfirmBtn = chatMain.querySelector('#btnFlowSubConfirm');
        if (flowSubSelect) {
            flowSubSelect.addEventListener('change', () => {
                if (flowDef.hasMaterialSelect) {
                    chat.materialAbastecimento = flowSubSelect.value;
                } else if (flowDef.hasValoresSelect) {
                    chat.valoresOpcao = flowSubSelect.value;
                }
                if (flowSubConfirmBtn) flowSubConfirmBtn.disabled = !flowSubSelect.value;
            });
        }
        if (flowSubConfirmBtn) {
            flowSubConfirmBtn.addEventListener('click', () => {
                if (flowDef.hasMaterialSelect && chat.materialAbastecimento) {
                    chat.flowState = 'abastecimento_boca_de_lobo';
                    renderActiveCard();
                } else if (flowDef.hasValoresSelect && chat.valoresOpcao) {
                    if (chat.valoresOpcao === 'Análise de Diferença') {
                        chat.flowState = 'valores_analise_diferenca';
                    }
                    // Análise de Crédito and Ficheiro can be extended in the future
                    renderActiveCard();
                }
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
        if (flowCopyBtn && chat.flowState) {
            const flowDef = getFlowDef(chat);
            if (!flowDef) return;
            let scriptText = '';
            if (typeof flowDef.getText === 'function') {
                scriptText = flowDef.getText(chat.clientName);
            } else {
                scriptText = flowDef.text;
            }
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
            const flowDef = getFlowDef(chat);
            if (!flowDef) return;

            if (action === 'yes') {
                chat.flowState = flowDef.yesState;
            } else if (action === 'no') {
                if (flowDef.noState === 'voltar_motivo') {
                    // Reset back to step 2 (motivo do contato)
                    chat.flowState = null;
                    chat.motivoContato = null;
                    chat.materialAbastecimento = '';
                    chat.valoresOpcao = '';
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
            // If on step 2 (motivo do contato), check selected value
            if (chat.currentStep === 1) {
                const motivoSelect = chatMain.querySelector('#motivoSelect');
                if (motivoSelect && motivoSelect.value === 'Cadastro') {
                    chat.motivoContato = 'Cadastro';
                    chat.flowState = 'cadastro_identificacao';
                    renderActiveCard();
                    return;
                }
                if (motivoSelect && motivoSelect.value === 'Abastecimento') {
                    chat.motivoContato = 'Abastecimento';
                    chat.flowState = 'abastecimento_script';
                    renderActiveCard();
                    return;
                }
                if (motivoSelect && motivoSelect.value === 'Valores') {
                    chat.motivoContato = 'Valores';
                    chat.flowState = 'valores_identificacao';
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
