# Captioned File

This is a JavaScript=TypeScript wrapper for the CPTN (CaPTioNed file) file format. For more info about the format check <https://github.com/Oakchris1955/Captioned-File>

## Usage

Initiate:

```js
import CPTN_Buffer from captionedfileformat;

// Create a new CPTN_Buffer
const data = new CPTN_Buffer();
```

Write data to CPTNBuffer:

```js
data.create_new("Some content...", "Caption 1234");
```

To read data as Buffer:

```js
const bytes = data.get_bytes();
console.log(bytes);
```

To read data from bytes:

```js
const new_data = new CPTN_Buffer();
console.log(new_data.read_from_bytes(bytes));
```
