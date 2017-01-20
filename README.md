# project-templater
This is a simple Node module for creating a new project from a template directory, and supports replacing placeholders in files with custom values.

## Installation
`yarn add project-templater`

## Usage
To use `project-templater`, it's as simple as the following code:

    // Load module
    var templater = require('templater');

    // Copy from the template folder to a new folder
    templater.copy('../template-project', './new-project', {
        // This is the context object. Placeholders in the format
        // of `$((key))` will be replaced with the appropriate
        // value from this object.
        name: 'MyProject',
        someKey: 'a value'
    }, (file) => file.endsWith('.js'));

## Documentation

### `copy(template, destination, context, filter?)`
- `template: string`  
    The path to the template project directory.
- `destination: string`  
    The path of the destination project directory. If this folder does not exist, it will be created.
- `context: Object`  
    The context object to be used for key-value replacement.
- `filter?: (file) => boolean`  
    An optional filter to control which files are copied over from the template. If this filter-callback returns `false` on a file, that file will not be copied. All file names passed to this callback are relative to the template folder.

## Templating examples
`<template>/myFile.txt`:

    This is my file about $((projectName)). Description: $((description)).

`context` object:

    {
        projectName: 'My Project',
        description: 'A fancy templated project'
    }

`<destination>/myFile.txt`:

    This is my file about My Project. Description: A fancy templated project.
    