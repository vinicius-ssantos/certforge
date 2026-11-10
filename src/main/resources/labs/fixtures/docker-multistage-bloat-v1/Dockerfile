# Fixture for lab "docker-multistage-bloat-v1" (#175).
#
# Bug: this is a single-stage build. The final image ships the full Go toolchain and the
# source tree alongside the compiled binary, even though only the binary is needed at
# runtime. The learner's objective is to rewrite this as a proper multi-stage build: compile
# in a builder stage, then copy only the resulting binary into a minimal final stage.
FROM golang:1.23

WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY main.go ./
RUN go build -o /out/app ./main.go

ENTRYPOINT ["/out/app"]
