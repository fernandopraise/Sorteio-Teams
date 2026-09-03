/**
 * Microsoft Authentication (MSAL) - Integração com Teams/Graph API
 * 
 * IMPORTANTE: Para usar a integração com Teams, você precisa:
 * 1. Registrar um app no Azure AD (https://portal.azure.com > App registrations)
 * 2. Configurar como SPA com redirect URI: http://localhost:3000
 * 3. Adicionar permissões: Calendars.Read, OnlineMeetings.Read, User.Read
 * 4. Substituir o CLIENT_ID abaixo pelo Application (client) ID do seu app
 */

const MSAL_CONFIG = {
    auth: {
        // SUBSTITUA pelo seu Application (client) ID do Azure AD
        clientId: 'SEU_CLIENT_ID_AQUI',
        authority: 'https://login.microsoftonline.com/common',
        redirectUri: window.location.origin
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false
    }
};

const LOGIN_REQUEST = {
    scopes: ['User.Read', 'Calendars.Read', 'OnlineMeetings.Read']
};

const GRAPH_SCOPES = {
    scopes: ['User.Read', 'Calendars.Read', 'OnlineMeetings.Read']
};

class AuthService {
    constructor() {
        this.msalInstance = null;
        this.account = null;
        this.initialized = false;
    }

    async initialize() {
        try {
            this.msalInstance = new msal.PublicClientApplication(MSAL_CONFIG);
            await this.msalInstance.initialize();
            
            // Verificar se já tem uma sessão
            const response = await this.msalInstance.handleRedirectPromise();
            if (response) {
                this.account = response.account;
            } else {
                const accounts = this.msalInstance.getAllAccounts();
                if (accounts.length > 0) {
                    this.account = accounts[0];
                }
            }
            
            this.initialized = true;
            return this.account !== null;
        } catch (error) {
            console.error('Erro ao inicializar MSAL:', error);
            throw error;
        }
    }

    async login() {
        try {
            const response = await this.msalInstance.loginPopup(LOGIN_REQUEST);
            this.account = response.account;
            return this.account;
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    }

    async getAccessToken() {
        if (!this.account) {
            throw new Error('Usuário não autenticado');
        }

        try {
            const response = await this.msalInstance.acquireTokenSilent({
                ...GRAPH_SCOPES,
                account: this.account
            });
            return response.accessToken;
        } catch (error) {
            // Se o token expirou, tentar interativamente
            if (error instanceof msal.InteractionRequiredAuthError) {
                const response = await this.msalInstance.acquireTokenPopup(GRAPH_SCOPES);
                return response.accessToken;
            }
            throw error;
        }
    }

    isAuthenticated() {
        return this.account !== null;
    }

    getAccountName() {
        return this.account ? this.account.name : null;
    }

    logout() {
        this.msalInstance.logoutPopup();
    }
}

class GraphService {
    constructor(authService) {
        this.authService = authService;
        this.baseUrl = 'https://graph.microsoft.com/v1.0';
    }

    async callGraph(endpoint) {
        const token = await this.authService.getAccessToken();
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || `Erro na API: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Busca eventos do calendário que estão acontecendo agora (reuniões em andamento)
     */
    async getCurrentMeetings() {
        const now = new Date();
        const startTime = new Date(now.getTime() - 60 * 60 * 1000).toISOString(); // 1h atrás
        const endTime = new Date(now.getTime() + 60 * 60 * 1000).toISOString(); // 1h à frente

        const data = await this.callGraph(
            `/me/calendarView?startDateTime=${startTime}&endDateTime=${endTime}&$filter=isOnlineMeeting eq true&$select=subject,start,end,onlineMeeting,attendees`
        );

        return data.value || [];
    }

    /**
     * Busca participantes de um evento/reunião específica
     */
    async getMeetingAttendees(eventId) {
        const data = await this.callGraph(`/me/events/${eventId}?$select=attendees,subject`);
        return data;
    }

    /**
     * Busca todos os contatos/pessoas para sugerir
     */
    async getPeople() {
        const data = await this.callGraph('/me/people?$top=50');
        return data.value || [];
    }

    /**
     * Tenta buscar participantes da reunião em andamento via Communications API
     * (Requer permissões adicionais - OnlineMeetings.Read)
     */
    async getOnlineMeetingParticipants(joinUrl) {
        try {
            // Decodificar a URL do meeting para obter o ID
            const meetingId = btoa(joinUrl);
            const data = await this.callGraph(`/me/onlineMeetings?$filter=joinWebUrl eq '${joinUrl}'`);
            
            if (data.value && data.value.length > 0) {
                const meeting = data.value[0];
                const participants = await this.callGraph(`/me/onlineMeetings/${meeting.id}/attendanceReports`);
                return participants;
            }
        } catch (error) {
            console.warn('Não foi possível buscar participantes via Communications API:', error);
        }
        return null;
    }

    /**
     * Busca a foto do perfil de um usuário
     */
    async getUserPhoto(userId) {
        try {
            const token = await this.authService.getAccessToken();
            const response = await fetch(`${this.baseUrl}/users/${userId}/photo/$value`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const blob = await response.blob();
                return URL.createObjectURL(blob);
            }
        } catch (error) {
            // Foto não disponível
        }
        return null;
    }
}

// Instâncias globais
const authService = new AuthService();
const graphService = new GraphService(authService);
