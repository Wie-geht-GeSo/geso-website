# use the official Bun image
FROM oven/bun:1 as base
WORKDIR /usr/src/app

# install dependencies into temp directory
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# build
ENV NODE_ENV=production
RUN bun run build

# copy production dependencies and static build files into final slim node image
FROM node:20.10.0-slim AS release

WORKDIR /app

COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/build /app/build
COPY --from=prerelease /usr/src/app/package.json .

# run the app
EXPOSE 3000

# Start the application
CMD ["node", "build"]