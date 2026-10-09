# The backend image. Built from source so the image is reproducible from a checkout.
FROM maven:3.9.11-eclipse-temurin-25 AS build
WORKDIR /src
COPY pom.xml ./
RUN --mount=type=cache,target=/root/.m2 mvn --batch-mode --no-transfer-progress -q dependency:go-offline -Dmaven.test.skip=true || true
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn --batch-mode --no-transfer-progress -DskipTests package \
    && cp target/certforge-*.jar /certforge.jar

FROM eclipse-temurin:25-jre
# Pick up the operating system security fixes published since the base image was built.
#
# Then delete pebble. It is Canonical's service manager, shipped in the base image, 9.9 MB of Go
# that this container never runs: the entrypoint below is the JVM. It belongs to no apt package —
# `dpkg -S /usr/bin/pebble` finds nothing — so the upgrade above can never patch it, and its
# vendored Go standard library is what the release scan reports (two HIGH denial-of-service
# advisories against Go 1.26.7 as of 2026-10-09). Removing it is not a suppression: the code is
# gone, so there is nothing left to be vulnerable and nothing left to scan.
RUN apt-get update && apt-get upgrade -y --no-install-recommends && rm -rf /var/lib/apt/lists/* \
    && rm -f /usr/bin/pebble \
    && useradd --system --uid 10001 --no-create-home certforge
COPY --from=build /certforge.jar /app/certforge.jar
USER 10001
EXPOSE 8080
# Container-aware memory limits come from the JVM itself. Everything else is configuration by
# environment variable (see compose.release.yaml and docs/engineering/release-environment.md).
ENTRYPOINT ["java", "-jar", "/app/certforge.jar"]
