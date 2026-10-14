# INTEXA — Controller Core

Esta Home Assistant App ejecuta Client, Installer, Config Service, el conector server-side con Home Assistant y el gateway restringido para Remote Client. Installer se usa mediante Home Assistant Ingress y conserva la autenticación administrativa de Home Assistant. Config Service escucha solo dentro de la App y guarda en `/data/controller-config.json`.

El Client Android prefiere acceso Local First: descubre `_homectl._tcp.local.`, valida la identidad TLS persistente de la instalación, su SPKI y `installationId`, y conecta directamente por LAN en 9443. Local no requiere Internet ni DNS público. Si Local falla explícitamente, usa automáticamente el hostname Remote provisionado mediante Cloudflare Tunnel. Ambos caminos conservan la misma identidad y autorización del dispositivo.

El gateway Remote escucha solamente en `127.0.0.1:4180` y publica únicamente las rutas necesarias del Client. No expone Installer, configuración administrativa, Home Assistant, HAOS ni la LAN. La credencial del túnel debe existir exclusivamente en `/data/controller-tunnel-token`, con propietario `root:root` y modo `0600`; nunca debe incluirse en el paquete.

## Preparar el paquete en el PC

Desde la raíz de este repositorio, ejecutar `npm run package:ha-app -- --seed` **solo para este primer piloto** si se desea importar el `data/controller-config.json` local. El empaquetado valida ese JSON antes de colocarlo como semilla. Sin `--seed`, la App inicializa una configuración vacía si `/data/controller-config.json` no existe. El resultado para copiar es el directorio completo `home-assistant-app/home-controller`, incluido su subdirectorio generado `artifacts`. No publicar una imagen que contenga la semilla de esta vivienda.

La App usa la semilla únicamente si `/data/controller-config.json` no existe. Nunca reemplaza automáticamente un archivo persistido durante un arranque o una actualización. Si el archivo existente es inválido, `/health` falla y los logs muestran el problema; hay que conservarlo para diagnóstico.

## Prueba manual en Home Assistant OS

1. Construir y empaquetar INTEXA en el PC con el comando anterior.
2. Copiar el directorio local `home-controller` completo a `/addons/home-controller` en Home Assistant OS mediante el acceso a archivos disponible.
3. En Home Assistant, actualizar *Local Apps* en **Settings → Apps → App store**.
4. Instalar la App INTEXA local.
5. Iniciarla y comprobar que **Start on boot** está habilitado.
6. Revisar los logs de la App y el estado de `/_health` en `:8088`.
7. Confirmar en logs que el conector server-side autentica mediante `SUPERVISOR_TOKEN` y queda listo para configuración, estados y `state_changed`.
8. Abrir Installer mediante Home Assistant Ingress.
9. Verificar que una cuenta HA no administradora no puede usar Installer ni escribir `/config`.
10. Verificar que una cuenta HA administradora accede a Installer y guarda configuración.
12. Comprobar que la configuración existente o la semilla se cargó según lo previsto.
13. Controlar `switch.test_luz_led` desde Client.
14. Abrir el Client Android en la LAN y comprobar discovery, validación TLS y pairing.
15. Reiniciar completamente el servidor físico Home Assistant.
16. Verificar que INTEXA arranca automáticamente.
17. Comprobar que Client Local e Installer por Ingress vuelven a responder.
18. Comprobar que `/data/controller-config.json` conserva módulos, componentes y `entityIds`.
19. Controlar de nuevo `switch.test_luz_led` desde Client.

La identidad Client pertenece al dispositivo y a la instalación, no a una IP ni al transporte Local/Remote. No desplegar Playwright ni los tests LIVE en el servidor.
