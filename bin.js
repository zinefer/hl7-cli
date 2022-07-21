#!/usr/bin/env node

var DELIMETERS = {
    SEGMENT: "\n",
    FIELD: /(?<!\\)\|/,
    COMPONENT: /(?<!\\)\^/,
    FIELDREPEAT: /(?<!\\)~/,
    SUBCOMPONENT: /(?<!\\)&/
};

var hl7 = {};

var fs = require("fs");
var stdinBuffer = fs.readFileSync(0); // STDIN_FILENO = 0

function forEachLeaf(obj, func) {
    if (obj.constructor === Array || obj.constructor == Object) {
        for (const k in obj) {
            obj[k] = forEachLeaf(obj[k], func);
        }
        return obj;
    } else {
        return func(obj);
    }
}

var segments = stdinBuffer.toString().split(DELIMETERS.SEGMENT);

segments.forEach(segment => {
    var name = segment.slice(0, 3);
    hl7[name] = segment.slice(4, -1);
});

var remainingDelimeters = [DELIMETERS.FIELD, DELIMETERS.FIELDREPEAT, DELIMETERS.COMPONENT, DELIMETERS.SUBCOMPONENT];

remainingDelimeters.forEach(delimeter => {    
    forEachLeaf(hl7, (leaf) => {
        if (leaf.search(delimeter) != -1) {
            return leaf.split(delimeter);
        }
        return leaf;
    });

});

console.log(JSON.stringify(hl7, null, 2));