# WOJ

Application de recettes self-hosted : recettes, menus, favoris, panier et liste de courses.

## Installation

L'image Docker est publiée sur GitHub Container Registry (`linux/amd64` et `linux/arm64`).

```sh
docker run -d \
  --name woj \
  -p 8080:80 \
  -v ./woj-data:/config \
  -e PUID=1000 \
  -e PGID=1000 \
  -e TZ=Europe/Paris \
  ghcr.io/bassintag/woj:latest
```

Ou avec Docker Compose :

```yaml
services:
  woj:
    image: ghcr.io/bassintag/woj:latest
    container_name: woj
    ports:
      - "8080:80"
    volumes:
      - ./woj-data:/config
    environment:
      PUID: 1000
      PGID: 1000
      TZ: Europe/Paris
    restart: unless-stopped
```

L'application est ensuite disponible sur http://localhost:8080.

## Configuration

| Variable | Défaut    | Description                                |
| -------- | --------- | ------------------------------------------ |
| `PUID`   | `1000`    | UID propriétaire des fichiers de `/config` |
| `PGID`   | `1000`    | GID propriétaire des fichiers de `/config` |
| `TZ`     | `Etc/UTC` | Fuseau horaire                             |

Le conteneur n'expose que le port `80`.

## Données

Tout est stocké dans le volume `/config` :

- `app.db` : base SQLite
- `images/` : images des recettes et des ingrédients

Les migrations sont appliquées automatiquement au démarrage.

## Mise à jour

```sh
docker compose pull
docker compose up -d
```

## Développement

```sh
bun install
docker compose up -d
bun run dev
```
