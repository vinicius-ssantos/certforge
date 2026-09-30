package dev.certforge;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class BootstrapUnitTest {

    @Test
    void testHarnessIsAvailable() {
        assertThat("certforge").isNotBlank();
    }
}
