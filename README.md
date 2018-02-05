
# PatchJS
A light library (a single class) to manage PATCH of an object by saving state changes.


You use a REST API, the PATCH HTTP verb, but you always send the full data? maybe you would like to send only the changes?

## Installation

```
npm install --save @jherault/patchjs
```

## Usage

```javascript

import PatchJS from '@jherault/patchjs';

//...

let myObject = {a: 0, b: "aString"}; // a pure object with no function 

let myObjectWithPatchOption = PatchJS.observe(myObject); //yes the name of this variable is a bit longer but...

myObjectWithPatchOption.a = 15;
myObjectWithPatchOption.c = {d: 10};

let headers = new Headers();
headers.append('Content-Type', 'application/json; charset=UTF-8');
headers.append('Accept', 'application/json');

fetch('anUrl', { 
    method: 'PATCH', 
    headers: headers, 
    body: JSON.stringify(myObjectWithPatchOption.patch()) // --> {"a":15,"c":{"d":10}}
    }).then(...);

```

----------
### Note
PatchJS.observe takes an object and an optional boolean ```typeChecking``` (default true) that prevent type change by assignment. If your types are dynamic, set this boolean to false.
```javascript
let o = PatchJS.observe({}, false);
```

### TODO
what about arrays... if an item is pushed/poped/updated...