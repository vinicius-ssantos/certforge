## Decision: preserve the formatter baseline

The prior rejected Dependabot PR #395 updated the Spotless Maven plugin to
3.11.0 without pinning its embedded Google Java Format implementation. Its
release notes document that the default changed from google-java-format 1.36.1
to 2.0.0, including optional non-whitespace cleanup behavior. The reported
46 Java-file differences were therefore not sufficient evidence of application
code debt or of a need to reformat the entire repository.

Use an explicit nested googleJavaFormat/version = 1.36.1 configuration with
the new Spotless 3.11.0 plugin. That makes the formatter contract explicit,
separates dependency maintenance from a codebase-wide formatting migration,
and maintains the existing source diff as the comparison baseline.

Verification gates:
- Ensure git comparison against the base changes zero .java source files.
- Run Maven verify/Spotless check with the full configured GitHub CI.
- Confirm E2E, frontend, CodeQL and release-image gates are green.
- If Spotless 3.11.0 fails even with formatter 1.36.1, do not force a merge:
  diagnose compatibility changes and revise this PR.
- A later deliberate move to google-java-format 2.0.0 can opt for cleanup
  configuration or apply formatting in a separate audited PR, with tests.

References: issue #425, Dependabot PR #395, failed CI run 44218120723.
