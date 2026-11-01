# Mapa del código · Postproceso (fx)

Qué archivo editar en el postproceso (bloom, DoF, streak, grading) y el fluido.

## Postproceso (fx)
| Para cambiar… | Edita |
| --- | --- |
| Orden de pasadas, eventos de capítulo, `settling` | `src/three/fx/pipeline.ts` |
| Tipos públicos (`CinematicFx`, `FxStats`) | `src/three/fx/types.ts` |
| Rack focus (retención y tirón de foco) | `src/three/fx/focus.ts` |
| Presupuesto GPU (qué se corta y cuándo) | `src/three/fx/adapt.ts` |
| Render targets y tamaños | `src/three/fx/targets.ts` |
| Cómo se dibuja cada pasada (uniforms) | `src/three/fx/passes/{bloom,streak,dof,composite}.ts` |
| GLSL de cada pasada | `src/three/fx/shaders/*.glsl.ts` (`coc.glsl.ts` lo comparten DoF y composite) |
| Simulación de fluido (chunk propio, se pide al primer movimiento del puntero) | `src/three/fx/fluid/field.ts`, GLSL en `fluid/simulation.glsl.ts` |
| Entrada de puntero del fluido | `src/three/fx/fluid/pointer.ts` |
| Paso del fluido por frame y uniforms compartidos | `src/three/fx/fluid/driver.ts` |
| Desplazar un material con el fluido | `src/three/fx/fluid/patch.ts` (`withFluidDisplacement`, `withFluidFragment`), GLSL en `fluid/displace.glsl.ts` |
| Uniforms compartidos del fluido | `src/three/fx/fluid/uniforms.ts` |
| Grading por capítulo | `src/three/fx/grading.ts` |
| Tokens y perfiles por tier | `src/three/fx/settings.ts` |
