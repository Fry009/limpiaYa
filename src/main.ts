// Polyfill required by @open-wc/scoped-elements to allow creating a
// CustomElementRegistry per shadow root in browsers that don't expose
// a public constructor. Must be imported before any scoped elements.
import "@webcomponents/scoped-custom-element-registry";

import "./ui/cleaning-app";
