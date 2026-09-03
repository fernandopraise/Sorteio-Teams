/**
 * App Principal - Orquestra UI, autenticação e roleta
 */

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});

class App {
    constructor() {
        this.roulette = new Roulette('roulette-canvas');
        this.allParticipants = [];
        this.removedParticipants = [];
        this.currentWinner = null;
    }

    init() {
        this.bindEvents();
        this.initAuth();
    }

    async initAuth() {
        try {
            await authService.initialize();
        } catch (error) {
            console.warn('MSAL não inicializado (necessário configurar CLIENT_ID):', error);
        }
    }

    bindEvents() {
        // Login Screen
        document.getElementById('btn-login').addEventListener('click', () => this.handleLogin());
        document.getElementById('btn-manual').addEventListener('click', () => this.showScreen('manual-screen'));

        // Manual Screen
        document.getElementById('btn-manual-back').addEventListener('click', () => this.showScreen('login-screen'));
        document.getElementById('btn-manual-start').addEventListener('click', () => this.handleManualStart());

        // Meeting Screen
        document.getElementById('btn-select-all').addEventListener('click', () => this.toggleSelectAll());
        document.getElementById('btn-start-roulette').addEventListener('click', () => this.startRouletteFromSelection());
        document.getElementById('btn-retry').addEventListener('click', () => this.fetchParticipants());

        // Roulette Screen
        document.getElementById('btn-spin').addEventListener('click', () => this.handleSpin());
        document.getElementById('btn-remove-winner').addEventListener('click', () => this.removeWinner());
        document.getElementById('btn-reset').addEventListener('click', () => this.resetRoulette());
        document.getElementById('btn-back-to-start').addEventListener('click', () => this.showScreen('login-screen'));
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(screenId).classList.remove('hidden');
    }

    // --- Autenticação Microsoft ---

    async handleLogin() {
        try {
            // Verificar se o CLIENT_ID foi configurado
            if (MSAL_CONFIG.auth.clientId === 'SEU_CLIENT_ID_AQUI') {
                this.showToast('⚠️ Configure o CLIENT_ID no arquivo auth.js primeiro!');
                this.showConfigHelp();
                return;
            }

            await authService.login();
            this.showScreen('meeting-screen');
            this.fetchParticipants();
        } catch (error) {
            console.error('Erro no login:', error);
            this.showToast('Erro ao fazer login. Verifique as configurações.');
        }
    }

    showConfigHelp() {
        const msg = `Para usar a integração com Teams:

1. Acesse https://portal.azure.com
2. Vá em "App registrations" > "New registration"
3. Nome: "Roleta Teams Sorteio"
4. Tipo: "Single-page application (SPA)"
5. Redirect URI: ${window.location.origin}
6. Em "API permissions", adicione:
   - Microsoft Graph > Delegated > User.Read
   - Microsoft Graph > Delegated > Calendars.Read  
   - Microsoft Graph > Delegated > OnlineMeetings.Read
7. Copie o "Application (client) ID"
8. Cole no arquivo auth.js (linha do clientId)

Enquanto isso, use "Inserir nomes manualmente"!`;

        alert(msg);
    }

    // --- Buscar Participantes do Teams ---

    async fetchParticipants() {
        const loading = document.getElementById('meeting-loading');
        const list = document.getElementById('participants-list');
        const error = document.getElementById('meeting-error');

        loading.classList.remove('hidden');
        list.classList.add('hidden');
        error.classList.add('hidden');

        try {
            // Tentar buscar reuniões em andamento
            const meetings = await graphService.getCurrentMeetings();
            
            let attendees = [];

            if (meetings.length > 0) {
                // Pegar participantes da primeira reunião em andamento
                const meeting = meetings[0];
                if (meeting.attendees) {
                    attendees = meeting.attendees.map(a => ({
                        name: a.emailAddress.name,
                        email: a.emailAddress.address
                    }));
                }
            }

            // Se não encontrou reunião, buscar pessoas recentes
            if (attendees.length === 0) {
                const people = await graphService.getPeople();
                attendees = people.map(p => ({
                    name: p.displayName,
                    email: p.scoredEmailAddresses?.[0]?.address || ''
                }));
            }

            if (attendees.length === 0) {
                throw new Error('Nenhum participante encontrado. Verifique se há uma reunião em andamento.');
            }

            this.renderParticipantsList(attendees);
            loading.classList.add('hidden');
            list.classList.remove('hidden');

        } catch (err) {
            console.error('Erro ao buscar participantes:', err);
            loading.classList.add('hidden');
            error.classList.remove('hidden');
            document.getElementById('error-message').textContent = 
                err.message || 'Erro ao buscar participantes. Tente novamente.';
        }
    }

    renderParticipantsList(attendees) {
        const grid = document.getElementById('participants-grid');
        const count = document.getElementById('participants-count');
        
        count.textContent = `${attendees.length} participantes encontrados`;
        grid.innerHTML = '';

        attendees.forEach((attendee, index) => {
            const item = document.createElement('div');
            item.className = 'participant-item selected';
            item.dataset.index = index;
            item.dataset.name = attendee.name;

            const initials = attendee.name.split(' ')
                .map(n => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase();

            item.innerHTML = `
                <input type="checkbox" checked>
                <div class="participant-avatar">${initials}</div>
                <span class="participant-name">${attendee.name}</span>
            `;

            item.addEventListener('click', (e) => {
                if (e.target.type !== 'checkbox') {
                    const checkbox = item.querySelector('input[type="checkbox"]');
                    checkbox.checked = !checkbox.checked;
                }
                item.classList.toggle('selected', item.querySelector('input').checked);
            });

            grid.appendChild(item);
        });
    }

    toggleSelectAll() {
        const items = document.querySelectorAll('.participant-item');
        const allSelected = [...items].every(i => i.classList.contains('selected'));
        
        items.forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            checkbox.checked = !allSelected;
            item.classList.toggle('selected', !allSelected);
        });
    }

    startRouletteFromSelection() {
        const selected = document.querySelectorAll('.participant-item.selected');
        const names = [...selected].map(item => item.dataset.name);

        if (names.length < 2) {
            this.showToast('Selecione pelo menos 2 participantes!');
            return;
        }

        this.startRoulette(names);
    }

    // --- Modo Manual ---

    handleManualStart() {
        const textarea = document.getElementById('manual-names');
        const text = textarea.value.trim();

        if (!text) {
            this.showToast('Digite pelo menos 2 nomes!');
            return;
        }

        // Separar por vírgula ou por linha
        let names = text.includes(',') 
            ? text.split(',').map(n => n.trim())
            : text.split('\n').map(n => n.trim());

        // Filtrar vazios
        names = names.filter(n => n.length > 0);

        if (names.length < 2) {
            this.showToast('Preciso de pelo menos 2 nomes para o sorteio!');
            return;
        }

        this.startRoulette(names);
    }

    // --- Roleta ---

    startRoulette(participants) {
        this.allParticipants = [...participants];
        this.removedParticipants = [];
        this.currentWinner = null;

        this.roulette.setParticipants(participants);
        this.showScreen('roulette-screen');
        this.updateRemovedList();
        document.getElementById('winner-display').classList.add('hidden');
    }

    handleSpin() {
        const btn = document.getElementById('btn-spin');
        
        if (this.roulette.isSpinning) return;
        if (this.roulette.getParticipantCount() < 2) {
            this.showToast('Precisa de pelo menos 2 participantes!');
            return;
        }

        btn.disabled = true;
        btn.textContent = '🎰 Girando...';
        document.getElementById('winner-display').classList.add('hidden');

        this.roulette.spin((winner, index) => {
            btn.disabled = false;
            btn.textContent = '🎲 GIRAR!';
            
            const name = typeof winner === 'string' ? winner : winner.name;
            this.currentWinner = { name, index };
            
            document.getElementById('winner-name').textContent = name;
            document.getElementById('winner-display').classList.remove('hidden');

            // Mostrar versículo do dia
            this.showVerse();

            // Efeito de confete simples
            this.celebrateWinner();
        });
    }

    removeWinner() {
        if (!this.currentWinner) return;

        this.roulette.removeByName(this.currentWinner.name);
        this.removedParticipants.push(this.currentWinner.name);
        
        this.updateRemovedList();
        document.getElementById('winner-display').classList.add('hidden');
        this.showToast(`Removido: ${this.currentWinner.name}`);
        this.currentWinner = null;

        if (this.roulette.getParticipantCount() < 2) {
            document.getElementById('btn-spin').disabled = true;
            this.showToast('Sorteio finalizado! Todos foram sorteados.');
        }
    }

    updateRemovedList() {
        const container = document.getElementById('removed-list');
        const names = document.getElementById('removed-names');

        if (this.removedParticipants.length === 0) {
            container.classList.add('hidden');
            return;
        }

        container.classList.remove('hidden');
        names.innerHTML = this.removedParticipants
            .map(n => `<span class="removed-tag">${n}</span>`)
            .join('');
    }

    resetRoulette() {
        this.removedParticipants = [];
        this.currentWinner = null;
        this.roulette.reset(this.allParticipants);
        this.updateRemovedList();
        document.getElementById('winner-display').classList.add('hidden');
        document.getElementById('btn-spin').disabled = false;
        this.showToast('Roleta reiniciada!');
    }

    // --- Helpers ---

    async showVerse() {
        const verse = await verseService.getVerse();
        document.getElementById('verse-text').textContent = verse.text;
        document.getElementById('verse-ref').textContent = `— ${verse.ref}`;
    }

    celebrateWinner() {
        // Mini confete com CSS
        const colors = ['#f59e0b', '#ef4444', '#10b981', '#6366f1', '#ec4899'];
        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: ${5 + Math.random() * 10}px;
                height: ${5 + Math.random() * 10}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}vw;
                top: -20px;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                animation: confettiFall ${2 + Math.random() * 2}s ease-out forwards;
                z-index: 9999;
                pointer-events: none;
            `;
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 4000);
        }

        // Adicionar keyframe se não existir
        if (!document.getElementById('confetti-style')) {
            const style = document.createElement('style');
            style.id = 'confetti-style';
            style.textContent = `
                @keyframes confettiFall {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    showToast(message, duration = 3000) {
        // Remover toast anterior
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <span>${message}</span>
            <button class="close-toast">&times;</button>
        `;
        
        toast.querySelector('.close-toast').addEventListener('click', () => toast.remove());
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, duration);
    }
}
