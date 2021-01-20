# win-upload

Upload Winnetou Plugin.

This plugin must be used in conjunction with WinnetouJs.

WinnetouUpload (win-upload) was created to facilitate the upload of files in a WinnetouJs application. It enables drag-and-drop of files and images, provides the URL blob for preview and also manages the upload of the form via ajax, serving the upload progress.

All done in the lightest possible way, without complications and without abstractions, with the final file having less than 4KB.

## How to Instal

```
npm i win-upload
```

## Importing

Remember to import with full path so that Chrome can correctly interpret it in dev mode.

```javascript
import { WinnetouUpload } from "../node_modules/win-upload/src/win-upload.js";
```

## Configuring

The WinnetouUpload works transforming a input file form field into a droppable label. So you need to create the CSS rules for that label. The css class names will always be "win-upload-label", with "&.dragenter" and "&.drop" SASS modifiers.

`Using SASS (.scss)`

```scss
body {
  padding: 30px;
}
.win-upload-label {
  width: 300px;
  height: 300px;
  background-color: #ee7777;
  border-radius: 10px;
  display: block;
  &.dragenter {
    background-color: blue;
  }
  &.drop {
    background-color: #fff;
  }
}
```

# Using

To use you will need a form constructo.

```html
<winnetou description="description">
  <form onsubmit="return false" id="[[upload]]">
    <input type="text" placeholder="seu status" name="status" />
    <input type="file" multiple id="[[files]]" name="files" />
  </form>
</winnetou>
```

and this is used in our example

```html
<winnetou description="description">
  <button id="[[btn]]" onclick="{{action}}">Clique</button>
</winnetou>

<winnetou description="description">
  <img id="[[img]]" src="{{src}}" width="100px" />
</winnetou>
```

this is complete code implementation

```javascript
import { Winnetou } from "../node_modules/winnetoujs/src/winnetou.js";
import { upload, btn, img } from "./constructos/elements.js";
import { WinnetouUpload } from "../node_modules/win-upload/src/win-upload.js";

render();

function render() {
  let container = upload().create("#app");

  let winUpload = new WinnetouUpload({
    form: container.ids.upload,
    input: container.ids.files,
  });

  winUpload.onFiles(thumbs => {
    Winnetou.select("img").remove();
    thumbs.map(url => {
      img({ src: url }).create("#win-upload-label");
    });
  });

  btn({
    action: Winnetou.fx(() => {
      winUpload
        .send("/upload", e => {
          console.log(e);
        })
        .then(s => {
          console.log("sucesso");
        })
        .catch(e => {
          console.log("error", e);
        });
    }),
  }).create("#app");
}
```

## WinnetouUpload class

Receiver two params in constructor method, form and input. Transforms input in a label.

## onFiles

Creates a event handler for drag'n drop and returns a callback when files are added. The call back is an array of blob strings urls.

## send

Uploads entire form with progress in a callback. Returns a promise when complete.
