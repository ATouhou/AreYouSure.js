# AreYouSure.js
jQuery plugin to check for unsaved changes before leaving a page.

## Installation

### Download
Download and estract the files to your project, and include:

```html
<script type="text/javascript" src="path/jquery.min.js"></script>
<script type="text/javascript" src="path/jquery.areYouSure.min.js"></script>
```

### Bower
Not supported at this moment

## Usage

### How to bind
```javascript
// Bind to all form elements
$('form').areYouSure();

// Bind to form elements except those with class a and/or b
$('form').areYouSure({except: '.a, .b'});

// Bind to specific element(s) with class
$('.element-with-class').areYouSure();
```

### Custom warning:
```javascript
$('form').areYouSure({
    warningText: 'Custom warning message'
});
```

## Authors
[Nikolaj Løvenhardt](http://github.com/nikolajlovenhardt)