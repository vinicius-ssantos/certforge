// Two directives for two different things: l is exported, so its public types are part of the
// API at compile time and at run time. q is opened, so reflection may reach every type and
// member in it, private ones included, but only at run time.
module lib {
  exports l;
  opens q;
}
