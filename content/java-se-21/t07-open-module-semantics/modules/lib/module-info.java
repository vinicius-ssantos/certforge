// An open module. Every package is open for deep reflection, including h, which is not exported.
// exports still names exactly one package, and that is what ordinary compile-time access goes by.
open module lib {
  exports l;
}
