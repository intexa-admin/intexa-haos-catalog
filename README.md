# INTEXA HAOS Catalog

Catálogo público de metadatos para instalar la App privada INTEXA en Home Assistant OS. No contiene el código fuente de Home Controller, Installer o Client, imágenes OCI ni credenciales de instalaciones.

## Publicación privada

El workflow manual construye un commit inmutable de `al-29/home-controller` y publica exclusivamente `ghcr.io/intexa-admin/home-controller:<version>` para `linux/amd64`.

Para leer el repositorio fuente privado utiliza `SOURCE_REPOSITORY_SSH_KEY`, una deploy key de solo lectura vinculada únicamente a `al-29/home-controller`. La publicación en GHCR usa el `GITHUB_TOKEN` efímero de este repositorio con `packages: write`; no requiere PAT de publicación persistente.

## Instalación autorizada

La imagen OCI permanece privada. Antes de agregar este repositorio a Home Assistant, el administrador configura en Supervisor una credencial de solo lectura para `ghcr.io`. La credencial no se guarda en este repositorio ni en la configuración de la App.

Después se agrega `https://github.com/intexa-admin/intexa-haos-catalog` como repositorio personalizado de Apps. Supervisor usa la versión declarada en `home_controller/config.yaml` y descarga la etiqueta homónima desde GHCR.

Las actualizaciones mantienen el mismo repositorio y `slug`, por lo que Supervisor conserva el directorio persistente `/data` de la App. Una migración desde una App local instalada por Samba es un procedimiento diferente y no debe realizarse desinstalando la App existente sin respaldo.
