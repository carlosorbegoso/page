# Pendiente

Lo que falta hacer y las preguntas abiertas para Carlos; cuando algo se termina, se borra de aquí en el mismo commit.

## Escritorio
- Badge «TCS · BCP» con lanyard.
- Carné de la UPC y post-its de los cofundadores.
- Texturas PBR de Poly Haven para el escritorio y la pared.
- GLB de Tripo para las figuras y los props (prompts en `docs/design/mascots.md`).

- Reflejo falso en la ventana desde los ángulos oblicuos.
- Decidir el look de las figuras antes de generarlas en Tripo: el Alfa de hoy es un robot de cerámica blanca con ojos, no el monolito de obsidiana del prompt (`docs/design/mascots.md`).

## Código muerto (sin borrar)
- `src/three/mascots/**` y `src/three/models.generated.ts`: nadie los importa; la parte `MASCOTS` de `scripts/optimize-assets.ts` solo los alimenta a ellos.
- Ruta heredada de estaciones: `registerStation`, `StationModule`, `LegacyDeskShots` y `World.setLegacy` (`src/three/world.ts`, `src/three/stage/modules.ts`).
- `scripts/capture-fallbacks.ts` manda `&progress=1&w=`, que `src/three/index.ts` ignora.
- Tokens que nadie lee: `--lamp-intensity`, `--monitor-intensity`, `--moonlight-intensity`, `--fx-chromatic-offset`, `--color-{burbu,gift,tool}-body` y los `--*-roughness` / `--*-metalness` de las figuras.
- Prop `shine` de `KineticText`: no la usa nadie.

## Marca
- El CV en PDF (`public/cv/Carlos-Orbegoso-CV.pdf`) no lleva el monograma «C»: no hay fuente editable en el repo.

## Medición
- FPS en el Android y el iPhone de Carlos con `?debug` (métricas en `localStorage['stage:metrics']`).

## Preguntas para Carlos
Sin respuesta; no se publica ninguna frase que dependa de ellas.
1. ¿Por qué empezaste a programar? ¿Hubo un momento concreto?
2. ¿Por qué pasaste de frontend (SYSARP) a backend (Baufest)?
3. ¿Qué te movió de Baufest a Intercorp y de Intercorp a TCS?
4. ¿En qué año fundaron TUSOCIO IA y cuál fue la chispa? ¿Se nombra a tus dos amigos?
5. ¿Por qué SkyMek y talleres mecánicos?
6. ¿En qué años estudiaste en la UPC, cuándo egresaste y ya tienes el título?
7. ¿Qué buscas hoy: un puesto, socios o clientes? Eso decide el botón principal del hero.
8. Cifras del hero: ¿cambiamos «Monolito → CQRS» por «3 productos en producción»?
