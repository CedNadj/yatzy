// apiClient.js - Handles all server communication
class ApiClient {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
        this.gameId = null;
    }

    async request(endpoint, options = {}) {
        try {
            const url = `${this.baseURL}${endpoint}`;
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw new Error('Network error: Unable to connect to server');
        }
    }

    // Game management
    async createNewGame() {
        const data = await this.request('/game/new', { method: 'POST' });
        this.gameId = data.gameId;
        return data;
    }

    async getGameState() {
        if (!this.gameId) throw new Error('No active game');
        return await this.request(`/game/${this.gameId}`);
    }

    async rollDice(heldDice = []) {
        if (!this.gameId) throw new Error('No active game');
        return await this.request(`/game/${this.gameId}/roll`, {
            method: 'POST',
            body: JSON.stringify({ heldDice })
        });
    }

    async scoreCategory(category) {
        if (!this.gameId) throw new Error('No active game');
        return await this.request(`/game/${this.gameId}/score`, {
            method: 'POST',
            body: JSON.stringify({ category })
        });
    }

    async toggleHold(dieIndex) {
        if (!this.gameId) throw new Error('No active game');
        return await this.request(`/game/${this.gameId}/hold`, {
            method: 'POST',
            body: JSON.stringify({ dieIndex })
        });
    }

    async forfeitGame() {
        if (!this.gameId) throw new Error('No active game');
        return await this.request(`/game/${this.gameId}/forfeit`, {
            method: 'POST'
        });
    }

    async getDiceAnalysis() {
        if (!this.gameId) throw new Error('No active game');
        return await this.request(`/game/${this.gameId}/analysis`);
    }

    getCurrentGameId() {
        return this.gameId;
    }
}

export default ApiClient;