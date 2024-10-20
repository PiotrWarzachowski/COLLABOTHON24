
FROM node:20-slim  AS development

ENV CI=true
ENV PORT=3000

RUN corepack enable pnpm

COPY . /code

WORKDIR /code

RUN pnpm install --no-frozen-lockfile

CMD [ "pnpm", "start" ]

FROM development AS builder

RUN corepack enable pnpm

RUN pnpm run build

FROM development AS dev-envs
RUN apt-get update
RUN apt-get install -y --no-install-recommends git

RUN useradd -s /bin/bash -m vscode
RUN groupadd docker
RUN usermod -aG docker vscode

COPY --from=gloursdocker/docker / /
CMD [ "pnpm", "start" ]
