// A consumer declares the service type it loads. Without uses, ServiceLoader finds nothing from
// this module, and the provider module is not even pulled into the graph.
module app {
  requires api;
  uses s.Greeter;
}
