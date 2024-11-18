# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/your-repo.git
```
```
cd your-repo
```
## Installing NPM modules

```
npm install
```

## Containerization with Docker

1. Build and start the containers:
```
docker-compose up --build
```
2. Verify that both containers are running:
```
docker ps
```
### 3. After the first start, you need to apply database migrations to set up the schema!
```
docker exec -it app-container npx prisma migrate deploy
```

## Testing

After application running in containers open new terminal and enter:

```
npm run test
```


### Linting

```
npm run lint
```


