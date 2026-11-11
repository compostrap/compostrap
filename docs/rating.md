# Rating

[← Compostrap](../readme.md#documentation)

Stars to choose a rating are radio inputs, so a form sends the value without JavaScript; the stars up to the checked one are filled, on hover they show the rating a click gives. A shown rating fills five stars to `--rating-value` (halves and tenths too). `rating-sm` and `rating-lg` change the size, `--rating-color` the color.

```html
<div class="rating" role="radiogroup" aria-label="Rating">
	<input type="radio" class="rating-input" name="rating" id="rating-1" value="1">
	<label class="rating-star" for="rating-1"><span class="visually-hidden">1 star</span></label>
	<!-- … up to 5 -->
</div>

<span class="rating-static" style="--rating-value: 4.5" role="img" aria-label="4.5 of 5"></span>
```
