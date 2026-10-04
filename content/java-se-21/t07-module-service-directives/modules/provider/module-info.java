// A provider declares what it implements and with which class. The directive names the service
// interface first and the implementation second, and the implementation must be in this module.
module provider {
  requires api;
  provides s.Greeter with p.Loud;
}
