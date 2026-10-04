// p is exported in full. Exporting controls which packages other modules may read; it does not
// change the access modifiers of the types inside.
module lib {
  exports p;
}
