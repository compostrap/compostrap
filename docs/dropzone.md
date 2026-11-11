# Dropzone

[← Compostrap](../readme.md#documentation)

A large area to drop files on or to click. It is a plain file input covering the area, so it stays the input of the form: validation and AJAX forms work as with a normal upload. It has no border; while files are dragged over it, it turns to the primary color.

```html
<label class="dropzone">
	<input type="file" name="images[]" class="dropzone-input" multiple accept="image/*" data-dropzone-submit>
	<i class="bi bi-cloud-arrow-up dropzone-icon" aria-hidden="true"></i>
	<span class="dropzone-title">Drop images here or <span class="dropzone-link">choose them</span></span>
	<span class="dropzone-hint">JPEG, PNG, GIF or WebP, at most 8 MB each.</span>
	<span class="dropzone-files" data-dropzone-files></span>
</label>
```

```javascript
import { DropzoneInput } from 'compostrap/dropzone';

DropzoneInput.init(); // again after new content is loaded, a dropzone is bound only once
```

The script highlights the area while files are dragged over it and writes the names of the chosen files into `[data-dropzone-files]`. With `data-dropzone-submit` on the input it submits the form as soon as files are chosen or dropped, so the form needs no upload button. An input with `is-invalid` tints the area red.
