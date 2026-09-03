/**
 * Roulette - Motor da roleta visual com animação
 */

class Roulette {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.participants = [];
        this.colors = [
            '#4285F4', // Azul Google
            '#EA4335', // Vermelho
            '#34A853', // Verde
            '#FBBC05', // Amarelo
            '#8B5CF6', // Roxo
            '#EC4899', // Rosa
            '#06B6D4', // Ciano
            '#F97316', // Laranja
            '#14B8A6', // Teal
            '#6366F1', // Indigo
        ];
        this.currentAngle = 0;
        this.isSpinning = false;
        this.spinCallback = null;
    }

    setParticipants(participants) {
        this.participants = [...participants];
        this.draw();
    }

    draw() {
        const ctx = this.ctx;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.participants.length === 0) {
            ctx.fillStyle = '#666';
            ctx.font = '20px Segoe UI';
            ctx.textAlign = 'center';
            ctx.fillText('Nenhum participante', centerX, centerY);
            return;
        }

        const sliceAngle = (2 * Math.PI) / this.participants.length;

        // Desenhar fatias
        this.participants.forEach((participant, index) => {
            const startAngle = this.currentAngle + index * sliceAngle;
            const endAngle = startAngle + sliceAngle;

            // Fatia
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = this.colors[index % this.colors.length];
            ctx.fill();

            // Borda da fatia
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Texto
            ctx.save();
            ctx.translate(centerX, centerY);
            const textAngle = startAngle + sliceAngle / 2;
            ctx.rotate(textAngle);

            const name = typeof participant === 'string' ? participant : participant.name;
            const displayName = name.length > 12 ? name.substring(0, 11) + '…' : name;
            
            ctx.fillStyle = '#fff';
            ctx.font = `bold ${this.getFontSize()}px Segoe UI`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Posicionar texto no meio do raio
            const textDistance = radius * 0.6;
            ctx.fillText(displayName, textDistance, 0);
            
            ctx.restore();
        });

        // Centro
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.12, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Sombra interna do centro
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.1, 0, 2 * Math.PI);
        ctx.fillStyle = '#f0f0f0';
        ctx.fill();
    }

    getFontSize() {
        const count = this.participants.length;
        if (count <= 4) return 20;
        if (count <= 6) return 17;
        if (count <= 8) return 15;
        if (count <= 12) return 13;
        return 11;
    }

    spin(callback) {
        if (this.isSpinning || this.participants.length === 0) return;

        this.isSpinning = true;
        this.spinCallback = callback;

        // Girar um ângulo aleatório grande (5-8 voltas + posição aleatória)
        const extraSpins = (5 + Math.random() * 3) * 2 * Math.PI;
        const randomOffset = Math.random() * 2 * Math.PI;
        const totalRotation = extraSpins + randomOffset;

        // Animação com easing
        const duration = 4000 + Math.random() * 2000; // 4-6 segundos
        const startTime = performance.now();
        const startAngle = this.currentAngle;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing: desacelera no final (cubic ease-out)
            const eased = 1 - Math.pow(1 - progress, 4);

            this.currentAngle = startAngle + totalRotation * eased;
            this.draw();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isSpinning = false;
                
                // Determinar o vencedor baseado na posição final do ponteiro
                const winnerIndex = this.getWinnerIndex();
                const winner = this.participants[winnerIndex];
                if (this.spinCallback) {
                    this.spinCallback(winner, winnerIndex);
                }
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * Calcula qual fatia está alinhada com o ponteiro (à direita, ângulo 0)
     */
    getWinnerIndex() {
        const sliceAngle = (2 * Math.PI) / this.participants.length;
        
        // Normalizar o ângulo atual para 0-2PI
        // O ponteiro está em ângulo 0 (direita)
        // Precisamos descobrir qual fatia está na posição 0
        let normalizedAngle = this.currentAngle % (2 * Math.PI);
        if (normalizedAngle < 0) {
            normalizedAngle += 2 * Math.PI;
        }
        
        // O ângulo da roleta é somado ao índice da fatia no draw()
        // Fatia i começa em: currentAngle + i * sliceAngle
        // Ponteiro está em 0, então queremos: currentAngle + i * sliceAngle <= 0 <= currentAngle + (i+1) * sliceAngle
        // Ou seja, a fatia no ponteiro é aquela onde: -currentAngle cai dentro do intervalo [i*sliceAngle, (i+1)*sliceAngle]
        
        let pointerAngle = (-normalizedAngle) % (2 * Math.PI);
        if (pointerAngle < 0) {
            pointerAngle += 2 * Math.PI;
        }
        
        const winnerIndex = Math.floor(pointerAngle / sliceAngle) % this.participants.length;
        return winnerIndex;
    }

    removeParticipant(index) {
        if (index >= 0 && index < this.participants.length) {
            const removed = this.participants.splice(index, 1)[0];
            this.draw();
            return removed;
        }
        return null;
    }

    removeByName(name) {
        const index = this.participants.findIndex(p => {
            const pName = typeof p === 'string' ? p : p.name;
            return pName === name;
        });
        if (index !== -1) {
            return this.removeParticipant(index);
        }
        return null;
    }

    reset(participants) {
        this.participants = [...participants];
        this.currentAngle = 0;
        this.draw();
    }

    getParticipantCount() {
        return this.participants.length;
    }
}
