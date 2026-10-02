// requires transitive, not plain requires: every module that reads lib also reads util, which is
// what lets app compile without naming util itself.
module lib {
  requires transitive util;

  exports l;
}
