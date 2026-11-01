# Revisión de dirección (2026-10-31)

Tres especialistas revisaron 30 capturas del recorrido (`1440-00..14`, `390-00..14`) y el código, solo lectura: director creativo (Claude Fable), tech lead WebGL y estratega de marca/contratación.

## Diagnóstico común
- **Mareo**: `blendPoses` (`src/three/scenes/stations.ts`) suma +3° de FOV, ±2,6° de roll que alterna de sentido y un arco vertical de 1,2 u en cada tramo; `scroll.ts` hace scrub de cada tramo en ~85vh, así que la cámara casi nunca está quieta; vuelos largos (escritorio → ventana → espacio en un tramo; ~180° alrededor de Alfa hacia contacto).
- **Todo se mueve a la vez**: parallax de cámara, vida de placas (balanceo, inclinación, respiración), deriva por palabra, proximidad por letra, fluido. No hay ancla visual.
- **Texto CSS3D que viaja, se reescala y se inclina** con la cámara: ilegible a mitad de tramo y no se ordena por profundidad contra WebGL (placas que tapan mascotas, texto bajo el HUD y el riel).
- **Dos mundos que no casan** (escritorio cálido semirrealista vs. espacio frío de primitivas); mascotas procedurales poco serias; el espacio comunica "soñador", no "ingeniero que entrega".
- **Contenido**: el rol técnico queda pequeño; experiencia empieza por SYSARP; productos ilegibles; cajas que contradicen la regla "texto suelto"; footer plano rompe la inmersión; el HUD de 4 píldoras es un header disfrazado.

## Direcciones propuestas
1. **"Una noche en el escritorio"** (director creativo y tech lead): un solo entorno con luz horneada; capítulos fijados (pin) con planos casi quietos; la cámara solo cambia de plano entre capítulos (dolly corto, rack focus); la acción la hacen objetos, luz y texto. Monitor = hero y "sobre mí"; peana bajo la lámpara = TUSOCIO IA y productos (macro de cada figura); estantería = experiencia; teléfono = contacto; cierre con la lámpara apagándose y amanecer en la ventana.
2. **"El sistema en producción"** (estratega): arquitectura 3D sobria como un plano — peticiones (partículas) que viajan por servicios, colas y BD; cada sección "despliega" un módulo; los tres productos salen del mismo núcleo (TUSOCIO IA). Cámara casi fija con travelling lateral.

## Reglas anti-mareo (consenso)
Roll 0°; FOV fijo por dispositivo; por tramo ≤ 45° de yaw, ≤ 1,5 m, ≤ 20°/s; transiciones 0,9–1,4 s; quieto:movimiento ≥ 70:30; el texto nunca rota ni reescala y entra cuando la cámara se asienta; una sola fuente de movimiento a la vez (el cursor mueve un nivel); reduced-motion = disolvencias de 300 ms.

## Contenido (estratega)
Rol + 3 cifras en los primeros segundos; experiencia en orden cronológico inverso (TCS primero, SYSARP en una línea); SkyMek como producto estrella con captura real, Parati y Ventixs honestamente "en construcción"; "modo lectura" con un clic; pie técnico ("Hecho con Astro + Three.js").

## Técnica (tech lead)
Reutilizar Stage/tier/DPR, FX (bloom, grano, viñeta; fluido solo en `high`), audio, kinetic text, tokens, i18n, SEO. Rehacer: scroll a capítulos pin + director de cámara con límites; texto: titulares en WebGL (troika MSDF) o HTML 2D anclado a puntos 3D, CSS3D solo en superficies frontales (monitor, teléfono). Calidad: modelos con luz horneada (Tripo → Blender → GLB meshopt/KTX2), ≤ 1,5 MB por capítulo. Medir en dispositivos reales.
