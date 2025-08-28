/* ===== LOGGER SIMPLE Y ROBUSTO ===== */

// ===== LOGGER BÁSICO =====
class SimpleLogger {
    constructor() {
        this.prefix = '[Portfolio]';
    }
    
    formatMessage(level, message) {
        const timestamp = new Date().toLocaleTimeString();
        return `${this.prefix} [${timestamp}] [${level.toUpperCase()}] ${message}`;
    }
    
    error(message, data = null) {
        const formattedMessage = this.formatMessage('error', message);
        console.error(formattedMessage, data);
    }
    
    warn(message, data = null) {
        const formattedMessage = this.formatMessage('warn', message);
        console.warn(formattedMessage, data);
    }
    
    info(message, data = null) {
        const formattedMessage = this.formatMessage('info', message);
        console.info(formattedMessage, data);
    }
    
    debug(message, data = null) {
        const formattedMessage = this.formatMessage('debug', message);
        console.debug(formattedMessage, data);
    }
    
    performance(label, duration) {
        const formattedMessage = this.formatMessage('perf', `${label}: ${duration.toFixed(2)}ms`);
        console.log(formattedMessage);
    }
    
    animation(message, data = null) {
        const formattedMessage = this.formatMessage('anim', message);
        console.log(formattedMessage, data);
    }
    
    threejs(message, data = null) {
        const formattedMessage = this.formatMessage('three', message);
        console.log(formattedMessage, data);
    }
}

// ===== INSTANCIA GLOBAL =====
const logger = new SimpleLogger();

// ===== FUNCIONES DE CONVENIENCIA =====
export const log = {
    error: (message, data) => logger.error(message, data),
    warn: (message, data) => logger.warn(message, data),
    info: (message, data) => logger.info(message, data),
    debug: (message, data) => logger.debug(message, data),
    performance: (label, duration) => logger.performance(label, duration),
    animation: (message, data) => logger.animation(message, data),
    threejs: (message, data) => logger.threejs(message, data)
};

// ===== FUNCIÓN DE INICIALIZACIÓN (NO HACE NADA, SOLO COMPATIBILIDAD) =====
export function initLogger(config = {}) {
    if (config.appName) {
        logger.prefix = `[${config.appName}]`;
    }
}

// ===== EXPORTAR LOGGER PARA COMPATIBILIDAD =====
export { logger };
