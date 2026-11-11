# Gallery

[← Compostrap](../readme.md#documentation)

Square tiles of images in a grid of Bootstrap. The buttons appear over the dimmed image on hover or keyboard focus; on touch screens they stay shown in a column at the right edge. The name sits at the bottom of the image on a dark fade, with the extension as a small label, and gives way to the buttons on hover.

```html
<div class="row row-cols-2 row-cols-lg-4 g-3">
	<div class="col">
		<figure class="gallery-item">
			<img src="photo.jpg" alt="" loading="lazy">
			<span class="gallery-badge"><span class="badge theme-primary">Main photo</span></span>
			<figcaption class="gallery-caption" title="photo.jpg"><span class="gallery-name">photo</span><span class="gallery-ext">jpg</span></figcaption>
			<div class="gallery-actions">
				<a href="..." class="btn btn-light btn-sm btn-icon" aria-label="Preview" data-tooltip><i class="bi bi-zoom-in"></i></a>
				<a href="..." class="btn btn-danger btn-sm btn-icon" aria-label="Delete" data-tooltip><i class="bi bi-trash"></i></a>
			</div>
		</figure>
	</div>
</div>
```

`gallery-thumb` is a small square image for a table row, e.g. the photo of a product in a datagrid. `gallery-actions show` keeps the buttons shown, e.g. for the confirmation of a delete with a `gallery-text` question.
