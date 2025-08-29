/* ===== CONFIGURACIÓN DE COMPONENTES ===== */

export const COMPONENTS_CONFIG = {
    // Componentes principales
    main: [
        {
            name: 'Header',
            target: 'body',
            data: {},
            order: 1
        },
        {
            name: 'Hero',
            target: '#main-content',
            data: {
                name: 'Carlos Orbegoso',
                role: 'Backend Developer & Java Specialist',
                company: 'Tata Consultancy Services',
                techStack: ['Java', 'Spring', 'Quarkus', 'Angular']
            },
            order: 2
        },
        {
            name: 'About',
            target: '#main-content',
            data: {
                title: 'Sobre Mí',
                description: 'Backend Developer con más de 5 años de experiencia en desarrollo de aplicaciones empresariales robustas y escalables.',
                image: 'src/assets/images/profile.jpeg'
            },
            order: 3
        },
        {
            name: 'Experience',
            target: '#main-content',
            data: {
                title: 'Experiencia',
                experiences: [
                    {
                        period: '2023 - Presente',
                        title: 'Senior Backend Developer',
                        company: 'Tata Consultancy Services',
                        description: 'Desarrollo de microservicios con Spring Boot y Quarkus.'
                    },
                    {
                        period: '2021 - 2023',
                        title: 'Backend Developer',
                        company: 'Tech Solutions Inc.',
                        description: 'Desarrollo de APIs RESTful con Spring Framework.'
                    }
                ]
            },
            order: 4
        },
        {
            name: 'Skills',
            target: '#main-content',
            data: {
                title: 'Habilidades',
                categories: [
                    {
                        name: 'Backend',
                        skills: ['Java 11+', 'Spring Boot', 'Quarkus', 'Microservicios']
                    },
                    {
                        name: 'Frontend',
                        skills: ['Angular', 'TypeScript', 'HTML5/CSS3', 'JavaScript ES6+']
                    },
                    {
                        name: 'DevOps',
                        skills: ['Docker', 'Kubernetes', 'Jenkins', 'AWS']
                    }
                ]
            },
            order: 5
        },
        {
            name: 'Projects',
            target: '#main-content',
            data: {
                title: 'Proyectos',
                projects: [
                    {
                        name: 'E-commerce Microservices',
                        type: 'Full Stack - Java + Angular',
                        description: 'Microservices architecture for e-commerce platform.',
                        tech: ['Java 11', 'Spring Cloud', 'Angular', 'MySQL', 'Kubernetes'],
                        icon: 'fas fa-shopping-cart'
                    },
                    {
                        name: 'Hospital Management System',
                        type: 'Backend - Quarkus',
                        description: 'Comprehensive hospital management system with Quarkus.',
                        tech: ['Quarkus', 'PostgreSQL', 'JUnit 5', 'Swagger', 'Docker'],
                        icon: 'fas fa-hospital'
                    }
                ]
            },
            order: 6
        },
        {
            name: 'Contact',
            target: '#main-content',
            data: {
                title: "Let's Connect!",
                subtitle: 'Are you looking for a challenging backend project?',
                email: 'carlos.orbegoso@email.com',
                linkedin: 'linkedin.com/in/carlosorbegoso',
                github: 'github.com/carlosorbegoso'
            },
            order: 7
        },
        {
            name: 'Footer',
            target: 'body',
            data: {
                copyright: '© 2024 Carlos Orbegoso. All rights reserved.'
            },
            order: 8
        }
    ],

    // Componentes opcionales
    optional: [
    
    ],

    // Configuración de carga
    loading: {
        strategy: 'sequential', // 'sequential' o 'parallel'
        delay: 100, // Delay entre componentes
        timeout: 5000, // Timeout por componente
        retryAttempts: 3
    }
};

// Función para obtener componentes ordenados
export function getOrderedComponents() {
    return COMPONENTS_CONFIG.main.sort((a, b) => a.order - b.order);
}

// Función para obtener componentes por condición
export function getConditionalComponents() {
    return COMPONENTS_CONFIG.optional.filter(comp => {
        if (comp.condition) {
            return comp.condition();
        }
        return true;
    });
}

// Función para obtener configuración de carga
export function getLoadingConfig() {
    return COMPONENTS_CONFIG.loading;
}
