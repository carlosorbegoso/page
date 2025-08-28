/* ===== UTILIDADES JAVASCRIPT LIMPIAS Y ORGANIZADAS ===== */

import { CONFIG } from '../config/config.js';

// ===== UTILIDADES DE DOM =====
export const DOM = {
    /**
     * Selecciona un elemento del DOM
     * @param {string} selector - Selector CSS
     * @param {Element} parent - Elemento padre (opcional)
     * @returns {Element|null}
     */
    select(selector, parent = document) {
        return parent.querySelector(selector);
    },
    
    /**
     * Selecciona múltiples elementos del DOM
     * @param {string} selector - Selector CSS
     * @param {Element} parent - Elemento padre (opcional)
     * @returns {NodeList}
     */
    selectAll(selector, parent = document) {
        return parent.querySelectorAll(selector);
    },
    
    /**
     * Crea un elemento HTML
     * @param {string} tag - Tag HTML
     * @param {Object} attributes - Atributos del elemento
     * @param {string} content - Contenido del elemento
     * @returns {Element}
     */
    create(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else {
                element.setAttribute(key, value);
            }
        });
        
        if (content) {
            element.innerHTML = content;
        }
        
        return element;
    },
    
    /**
     * Agrega clases CSS a un elemento
     * @param {Element} element - Elemento DOM
     * @param {...string} classes - Clases CSS
     */
    addClasses(element, ...classes) {
        element.classList.add(...classes);
    },
    
    /**
     * Remueve clases CSS de un elemento
     * @param {Element} element - Elemento DOM
     * @param {...string} classes - Clases CSS
     */
    removeClasses(element, ...classes) {
        element.classList.remove(...classes);
    },
    
    /**
     * Toggle de clases CSS
     * @param {Element} element - Elemento DOM
     * @param {string} className - Clase CSS
     * @param {boolean} force - Forzar estado (opcional)
     */
    toggleClass(element, className, force) {
        element.classList.toggle(className, force);
    }
};

// ===== UTILIDADES DE EVENTOS =====
export const Events = {
    /**
     * Agrega un event listener con opciones
     * @param {Element} element - Elemento DOM
     * @param {string} event - Tipo de evento
     * @param {Function} handler - Manejador del evento
     * @param {Object} options - Opciones del evento
     */
    on(element, event, handler, options = {}) {
        element.addEventListener(event, handler, options);
    },
    
    /**
     * Remueve un event listener
     * @param {Element} element - Elemento DOM
     * @param {string} event - Tipo de evento
     * @param {Function} handler - Manejador del evento
     */
    off(element, event, handler) {
        element.removeEventListener(event, handler);
    },
    
    /**
     * Dispara un evento personalizado
     * @param {Element} element - Elemento DOM
     * @param {string} eventName - Nombre del evento
     * @param {Object} detail - Datos del evento
     */
    trigger(element, eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail });
        element.dispatchEvent(event);
    }
};

// ===== UTILIDADES DE PERFORMANCE =====
export const Performance = {
    /**
     * Debounce de función
     * @param {Function} func - Función a debounce
     * @param {number} delay - Delay en ms
     * @returns {Function}
     */
    debounce(func, delay = CONFIG.PERFORMANCE.DEBOUNCE_DELAY) {
        let timeoutId;
        
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },
    
    /**
     * Throttle de función
     * @param {Function} func - Función a throttle
     * @param {number} delay - Delay en ms
     * @returns {Function}
     */
    throttle(func, delay = CONFIG.PERFORMANCE.THROTTLE_DELAY) {
        let lastCall = 0;
        
        return function (...args) {
            const now = Date.now();
            
            if (now - lastCall >= delay) {
                lastCall = now;
                func.apply(this, args);
            }
        };
    },
    
    /**
     * Mide el tiempo de ejecución de una función
     * @param {Function} func - Función a medir
     * @param {string} label - Etiqueta para el log
     * @returns {any}
     */
    measureTime(func, label = 'Function execution') {
        const start = performance.now();
        const result = func();
        const end = performance.now();
        
        if (CONFIG.DEBUG) {
            console.log(`${label}: ${(end - start).toFixed(2)}ms`);
        }
        
        return result;
    }
};

// ===== UTILIDADES DE ARRAYS =====
export const Arrays = {
    /**
     * Shuffle de array
     * @param {Array} array - Array a shuffle
     * @returns {Array}
     */
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    /**
     * Chunk de array
     * @param {Array} array - Array a chunk
     * @param {number} size - Tamaño del chunk
     * @returns {Array}
     */
    chunk(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    },
    
    /**
     * Remueve duplicados de un array
     * @param {Array} array - Array a limpiar
     * @returns {Array}
     */
    unique(array) {
        return [...new Set(array)];
    }
};

// ===== UTILIDADES DE OBJETOS =====
export const Objects = {
    /**
     * Merge profundo de objetos
     * @param {Object} target - Objeto objetivo
     * @param {...Object} sources - Objetos fuente
     * @returns {Object}
     */
    deepMerge(target, ...sources) {
        if (!sources.length) return target;
        
        const source = sources.shift();
        
        if (isObject(target) && isObject(source)) {
            for (const key in source) {
                if (isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    deepMerge(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
        
        return deepMerge(target, ...sources);
    },
    
    /**
     * Clona profundo un objeto
     * @param {Object} obj - Objeto a clonar
     * @returns {Object}
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => deepClone(item));
        if (typeof obj === 'object') {
            const cloned = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloned[key] = deepClone(obj[key]);
                }
            }
            return cloned;
        }
    }
};

// ===== UTILIDADES DE STRINGS =====
export const Strings = {
    /**
     * Capitaliza la primera letra
     * @param {string} str - String a capitalizar
     * @returns {string}
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    
    /**
     * Genera un ID único
     * @param {number} length - Longitud del ID
     * @returns {string}
     */
    generateId(length = 8) {
        return Math.random().toString(36).substring(2, length + 2);
    },
    
    /**
     * Trunca un string
     * @param {string} str - String a truncar
     * @param {number} length - Longitud máxima
     * @param {string} suffix - Sufijo (opcional)
     * @returns {string}
     */
    truncate(str, length, suffix = '...') {
        return str.length > length ? str.substring(0, length) + suffix : str;
    }
};

// ===== UTILIDADES DE VALIDACIÓN =====
export const Validation = {
    /**
     * Valida si es un email válido
     * @param {string} email - Email a validar
     * @returns {boolean}
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    /**
     * Valida si es un número
     * @param {any} value - Valor a validar
     * @returns {boolean}
     */
    isNumber(value) {
        return !isNaN(value) && isFinite(value);
    },
    
    /**
     * Valida si es un objeto
     * @param {any} value - Valor a validar
     * @returns {boolean}
     */
    isObject(value) {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }
};

// ===== FUNCIONES AUXILIARES =====
function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

function deepMerge(target, ...sources) {
    return Objects.deepMerge(target, ...sources);
}

function deepClone(obj) {
    return Objects.deepClone(obj);
}
