package dev.certforge.progress.internal;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class AccuracyTest {

  @Test
  void isAbsentUntilSomethingHasBeenAttempted() {
    assertThat(ProgressService.accuracy(0, 0)).isNull();
  }

  @Test
  void isTheShareOfCorrectAttemptsToFourDecimals() {
    assertThat(ProgressService.accuracy(3, 2)).isEqualByComparingTo(new BigDecimal("0.6667"));
    assertThat(ProgressService.accuracy(3, 1)).isEqualByComparingTo(new BigDecimal("0.3333"));
    assertThat(ProgressService.accuracy(8, 1)).isEqualByComparingTo(new BigDecimal("0.1250"));
  }

  @Test
  void coversTheExtremes() {
    assertThat(ProgressService.accuracy(5, 5)).isEqualByComparingTo(BigDecimal.ONE);
    assertThat(ProgressService.accuracy(5, 0)).isEqualByComparingTo(BigDecimal.ZERO);
  }

  @Test
  void roundsHalfUp() {
    // 1/8 = 0.125 exactly; 2/3 = 0.66666... rounds up; 1/6 = 0.16666... rounds up.
    assertThat(ProgressService.accuracy(6, 1)).isEqualByComparingTo(new BigDecimal("0.1667"));
  }
}
