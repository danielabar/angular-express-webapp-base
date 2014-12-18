Feel free to create subdirectories (packages) with one LESS file per widget/directive here. It is helpful if the name of the less file (less/widget.less) corresponds to the name of the directive (js/directives/widget.js), the template (templates/widget.html) and the controller (js/controllers/widget-controller.js).

Each less file can be included in styles.less via @import.

Each stylesheet from bower packages can be included as well, via @import if it is a LESS file, such as from bootstrap, or via @import (inline) if it is a CSS file.
