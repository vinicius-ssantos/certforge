## Why

Dependabot PR #395 upgraded the Spotless Maven plugin from 3.10.4 to 3.11.0,
but the Java CI failed with 46 formatting diffs. Spotless 3.11.0 changes the
default google-java-format version from 1.36.1 to 2.0.0, which additionally
performs non-whitespace cleanups. Bundling a mechanical source rewrite with
a build-tool upgrade adds unrelated code churn and risks hiding semantic changes.

## What Changes

Upgrade the Maven plugin to 3.11.0 while explicitly retaining the existing
google-java-format version 1.36.1 in the plugin configuration. The project's
formatting baseline remains unchanged; there is no mass reformatting and no
source-code modification. A future 2.0.0 formatter migration must be reviewed
as a distinct change, with a complete diff and appropriate tests.

## Impact

Only the root pom.xml and OpenSpec documentation change. The Spotless check
remains a gate in Maven verify. This does not change any application code,
database, release image contents or publication state. GitHub CI must establish
whether the new plugin with an explicitly pinned formatter is compatible.
