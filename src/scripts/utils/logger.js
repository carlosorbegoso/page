/* ===== LOGGER SIMPLE Y ROBUSTO ===== */

// ===== LOGGER BÁSICO =====
class SimpleLogger {
    constructor() {
        this.prefix = '[Portfolio]';
        this.logLevel = 'warn'; // Solo mostrar warn y error por defecto
    }
    
    formatMessage(level, message) {
        const timestamp = new Date().toLocaleTimeString();
        return `${this.prefix} [${timestamp}] [${level.toUpperCase()}] ${message}`;
    }
    
    shouldLog(level) {
        const levels = { error: 0, warn: 1, info: 2, debug: 3 };
        return levels[level] <= levels[this.logLevel];
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
        if (this.shouldLog('info')) {
            const formattedMessage = this.formatMessage('info', message);
            console.info(formattedMessage, data);
        }
    }
    
    debug(message, data = null) {
        if (this.shouldLog('debug')) {
            const formattedMessage = this.formatMessage('debug', message);
            console.debug(formattedMessage, data);
        }
    }
    
    performance(message, data = null) {
        if (this.shouldLog('info')) {
            const formattedMessage = this.formatMessage('perf', message);
            console.log(formattedMessage, data);
        }
    }
    
    animation(message, data = null) {
        if (this.shouldLog('info')) {
            const formattedMessage = this.formatMessage('anim', message);
            console.log(formattedMessage, data);
        }
    }
    
    threejs(message, data = null) {
        if (this.shouldLog('info')) {
            const formattedMessage = this.formatMessage('three', message);
            console.log(formattedMessage, data);
        }
    }
    
    // Método para cambiar el nivel de logging
    setLogLevel(level) {
        this.logLevel = level;
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
    performance: (message, data) => logger.performance(message, data),
    animation: (message, data) => logger.animation(message, data),
    threejs: (message, data) => logger.threejs(message, data),
    setLogLevel: (level) => logger.setLogLevel(level)
};

// ===== FUNCIÓN DE INICIALIZACIÓN =====
export function initLogger(config = {}) {
    if (config.appName) {
        logger.prefix = `[${config.appName}]`;
    }
    if (config.logLevel) {
        logger.setLogLevel(config.logLevel);
    }
}

// ===== EXPORTAR LOGGER PARA COMPATIBILIDAD =====
export { logger };
