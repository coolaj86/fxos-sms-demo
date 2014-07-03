Firefox OS SMS Demo
===================

A demo app for sending and receiving SMS.

This is the "Hello World" of SMS apps for Firefox OS.

Notes
=====

  * Tested working in Firefox OS 1.3.0 on the ZTE Open C with a T-Mobile SIM.
  * Only `manifest.webapp.type == certified` apps get access to SMS APIs.
  * The API is buggy / incomplete and Mozilla's documentation doesn't always match their implementation
  * It seems that the `received` event listener only works if you've first interacting with the messaging API in some other way
  * I don't know if you can capture the SMS event to `stopPropagation()` up to OS level.

Possible Errors
======

  * NoSim-something-or-other - the sim card is missing
  * The `Debug` feature of `App Manager` doesn't seem to work with this... perhaps because it's a `certified` app???
