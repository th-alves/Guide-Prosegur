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
                line = `${nome} ${sobrenome} - Matrícula ${matricula} - ${funcao} ${comSenha ? 'com senha' : 'sem senha'}`;
                if (comSenha && senhaValue) {
                    line += ` - Senha: ${senhaValue}`;
                }
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
                '-',
                `Usuários chegaram ao cofre às: ${f('horarioCofre')}`,
                '-',
                `Nome: ${f('nome')}`,
                `Contato: ${f('contato')}`,
                `CNPJ/Protocolo: *${f('cnpj')}*`,
                '-',
                `Nome no Mi Prosegur: ${f('nomeMi')}`,
                `Localizado no Mi: ${f('localizadoMi')}`,
                `Usuários criados: ${f('usuariosCriados')}`
            ],
            manual_15: () => [
                '-',
                `Nome: ${f('nome')}`,
                `Contato: ${f('contato')}`,
                `Material: ${f('material')}`
            ],
            manual_03: () => [
                '-',
                `Nome: ${f('nome')}`,
                `Contato: ${f('contato')}`,
                `E-mail: ${f('email')}`,
                '-',
                `Valor Depositado: ${f('valorDepositado')}`,
                `Valor Contabilizado: ${f('valorContabilizado')}`,
                `Valor da Diferença: ${f('valorDiferenca')}`,
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

    // ---- SCRIPTS WHATSAPP COPY ----
    document.querySelectorAll('.btn-copy[data-script]').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.script-card');
            const body = card.querySelector('.script-body');
            const text = Array.from(body.querySelectorAll('p')).map(p => p.textContent).join('\n');
            copyToClipboard(text);
            showToast('Script copiado com sucesso!');
        });
    });

    // ---- UTILITIES ----
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
