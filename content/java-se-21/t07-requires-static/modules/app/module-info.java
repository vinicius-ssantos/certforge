// requires static: app compiles against optional, but at run time the module system does not
// resolve it unless something else pulls it in.
module app {
  requires static optional;
}
