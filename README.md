# INTEXA HAOS Catalog

Repositorio de distribución de la App privada INTEXA para Home Assistant OS. Contiene solo metadatos del catálogo y automatización de publicación; no contiene el código fuente de Home Controller, Installer o Client.

## Publicación privada

El workflow manual construye un commit inmutable de `al-29/home-controller` y publica exclusivamente `ghcr.io/intexa-admin/home-controller:<version>` para `linux/amd64`.

Para leer el repositorio fuente privado utiliza `SOURCE_REPOSITORY_SSH_KEY`, una deploy key de solo lectura vinculada únicamente a `al-29/home-controller`. La publicación en GHCR usa el `GITHUB_TOKEN` efímero de este repositorio con `packages: write`; no requiere PAT de publicación persistente.

El catálogo privado no debe asumirse compatible directamente con Supervisor. Su mecanismo de entrega se resolverá antes de instalar Casa 02.
