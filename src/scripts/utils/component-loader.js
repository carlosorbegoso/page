/* ===== SISTEMA DE CARGA DE COMPONENTES ===== */

export class ComponentLoader {
    constructor() {
        this.components = new Map();
        this.loadedComponents = new Set();
    }

    /**
     * Carga un componente HTML
     * @param {string} componentName - Nombre del componente
     * @param {string} targetSelector - Selector del elemento donde insertar
     * @param {Object} data - Datos para el componente
     * @returns {Promise<Element>}
     */
    async loadComponent(componentName, targetSelector, data = {}) {
        try {
            // Verificar si ya está cargado
            if (this.loadedComponents.has(componentName)) {
                return this.components.get(componentName);
            }

            // Cargar el archivo del componente
            const response = await fetch(`src/components/${componentName}.html`);
            if (!response.ok) {
                throw new Error(`Error cargando componente: ${componentName}`);
            }

            const html = await response.text();
            
            // Crear elemento temporal para procesar el HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html.trim();
            
            // Obtener el primer elemento hijo
            const component = tempDiv.firstElementChild;
            
            // Procesar datos del componente
            this.processComponentData(component, data);
            
            // Insertar en el target
            const target = document.querySelector(targetSelector);
            if (target) {
                target.appendChild(component);
            }
            
            // Guardar referencia
            this.components.set(componentName, component);
            this.loadedComponents.add(componentName);
            
         
            return component;
            
        } catch (error) {
            console.error(`❌ Error cargando componente ${componentName}:`, error);
            throw error;
        }
    }

    /**
     * Procesa los datos del componente
     * @param {Element} component - Elemento del componente
     * @param {Object} data - Datos a procesar
     */
    processComponentData(component, data) {
        // Reemplazar placeholders con datos
        Object.keys(data).forEach(key => {
            const placeholder = `{{${key}}}`;
            const elements = component.querySelectorAll(`[data-bind="${key}"]`);
            
            elements.forEach(element => {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.value = data[key];
                } else {
                    element.textContent = data[key];
                }
            });
        });
    }

    /**
     * Carga múltiples componentes
     * @param {Array} components - Array de objetos {name, target, data}
     * @returns {Promise<Array>}
     */
    async loadComponents(components) {
        const promises = components.map(comp => 
            this.loadComponent(comp.name, comp.target, comp.data)
        );
        
        return Promise.all(promises);
    }

    /**
     * Recarga un componente
     * @param {string} componentName - Nombre del componente
     * @param {string} targetSelector - Selector del target
     * @param {Object} data - Nuevos datos
     * @returns {Promise<Element>}
     */
    async reloadComponent(componentName, targetSelector, data = {}) {
        // Remover componente existente
        const existingComponent = this.components.get(componentName);
        if (existingComponent && existingComponent.parentNode) {
            existingComponent.parentNode.removeChild(existingComponent);
        }
        
        // Limpiar referencias
        this.components.delete(componentName);
        this.loadedComponents.delete(componentName);
        
        // Recargar
        return this.loadComponent(componentName, targetSelector, data);
    }

    /**
     * Obtiene un componente cargado
     * @param {string} componentName - Nombre del componente
     * @returns {Element|null}
     */
    getComponent(componentName) {
        return this.components.get(componentName) || null;
    }

    /**
     * Verifica si un componente está cargado
     * @param {string} componentName - Nombre del componente
     * @returns {boolean}
     */
    isComponentLoaded(componentName) {
        return this.loadedComponents.has(componentName);
    }

    /**
     * Limpia todos los componentes
     */
    clearComponents() {
        this.components.forEach(component => {
            if (component.parentNode) {
                component.parentNode.removeChild(component);
            }
        });
        
        this.components.clear();
        this.loadedComponents.clear();
    }
}

// Instancia global
export const componentLoader = new ComponentLoader();
