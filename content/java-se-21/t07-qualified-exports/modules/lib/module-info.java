// A qualified export: the package is available to the two named modules and to nobody else.
module lib {
  exports l to app, other;
  exports q;
}
