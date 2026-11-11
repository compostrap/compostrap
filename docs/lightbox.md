# Lightbox

[← Compostrap](../readme.md#documentation)

A link with `data-lightbox` opens its image in a full-screen preview on a dark backdrop. Links with the same value form a group: the arrows, the keys ← → and a swipe browse it, a counter shows the position. `data-caption` is the text under the image. It is built on the native `<dialog>`: Esc or a click beside the image closes it and the focus returns to the link.

```html
<a href="photo-large.jpg" data-lightbox="gallery" data-caption="photo.jpg">
	<img src="photo-small.jpg" alt="">
</a>
```

```javascript
import { Lightbox } from 'compostrap/lightbox';

Lightbox.init(); // once; links loaded later by AJAX work without a new init
Lightbox.init({ dialog: 'Náhled obrázku', close: 'Zavřít', previous: 'Předchozí', next: 'Další' }); // translated labels
```
