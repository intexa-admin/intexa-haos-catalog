# INTEXA — Controller Core

Esta Home Assistant App ejecuta Client, Installer, Config Service, el conector server-side con Home Assistant y el gateway restringido para Remote Client. Installer se usa mediante Home Assistant Ingress y conserva la autenticación administrativa de Home Assistant. Config Service escucha solo dentro de la App y guarda en `/data/controller-config.json`.

El Client Android prefiere acceso Local First: descubre `_homectl._tcp.local.`, valida la identidad TLS persistente de la instalación, su SPKI y `installationId`, y conecta directamente por LAN en 9443. Local no requiere Internet ni DNS público. Si Local falla explícitamente, usa automáticamente el hostname Remote provisionado mediante Cloudflare Tunnel. Ambos caminos conservan la misma identidad y autorización del dispositivo.

El gateway Remote escucha solamente en `127.0.0.1:4180` y publica únicamente las rutas necesarias del Client. No expone Installer, configuración administrativa, Home Assistant, HAOS ni la LAN. La credencial del túnel debe existir exclusivamente en `/data/controller-tunnel-token`, con propietario `root:root` y modo `0600`; nunca debe incluirse en el paquete.

## Instalación en Home Assistant OS

La imagen de INTEXA es privada. El administrador debe registrar primero en Supervisor una credencial `ghcr.io` de solo lectura y después agregar este catálogo como repositorio personalizado.

1. En Home Assistant, abrir **Settings → Apps → App store**.
2. En el menú de la tienda, registrar la credencial autorizada para `ghcr.io`.
3. Agregar `https://github.com/intexa-admin/intexa-haos-catalog` como repositorio personalizado.
4. Actualizar la tienda e instalar INTEXA.
5. Iniciarla y comprobar que **Start on boot** está habilitado.
6. Revisar los logs de la App y el estado de `/_health` en `:8088`.
7. Confirmar en logs que el conector server-side autentica mediante `SUPERVISOR_TOKEN` y queda listo para configuración, estados y `state_changed`.
8. Abrir Installer mediante Home Assistant Ingress.
9. Verificar que una cuenta HA no administradora no puede usar Installer ni escribir `/config`.
10. Verificar que una cuenta HA administradora accede a Installer y guarda configuración.
12. Comprobar que la configuración persistente se cargó según lo previsto.
13. Controlar `switch.test_luz_led` desde Client.
14. Abrir el Client Android en la LAN y comprobar discovery, validación TLS y pairing.
15. Reiniciar completamente el servidor físico Home Assistant.
16. Verificar que INTEXA arranca automáticamente.
17. Comprobar que Client Local e Installer por Ingress vuelven a responder.
18. Comprobar que `/data/controller-config.json` conserva módulos, componentes y `entityIds`.
19. Controlar de nuevo `switch.test_luz_led` desde Client.

La identidad Client pertenece al dispositivo y a la instalación, no a una IP ni al transporte Local/Remote. No desplegar Playwright ni los tests LIVE en el servidor.
