
FROM node:20-slim  AS development

ENV CI=true
ENV PORT=3000


ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
RUN corepack enable

WORKDIR /code
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --no-frozen-lockfile

CMD [ "pnpm", "start" ]

FROM development AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
RUN corepack enable

RUN pnpm run build

FROM development as dev-envs
RUN apt-get update
RUN apt-get install -y --no-install-recommends git

RUN useradd -s /bin/bash -m vscode
RUN groupadd docker
RUN usermod -aG docker vscode

COPY --from=gloursdocker/docker / /
CMD [ "pnpm", "start" ]
