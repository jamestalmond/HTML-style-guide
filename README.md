# AO HTML style guide

A style guide for HTML at AO.com.





## General

### Document Type

Use HTML5

``` html
<!DOCTYPE html>
```

### Encoding

Use UTF-8 encoding as character encoding.

``` html
<meta charset="utf-8">
```

### Type Attributes

Always omit `type` attributes for stylesheets and scripts.

HTML5 does not require the `type` attribute on `link` and `script` elements.

``` html
<link rel="stylesheet" href="css/styles.css">
```

``` html
<script src="js/script.js"></script>
```

### Semantics

HTML should be semantic.

Elements should __only__ be used for their semantic purpose, for example:

- `<p>` for paragraphs
- `<a>` for anchor links
- `<h1> - <h6>` for headings

### Images

Images should be output using `img` or `picture` elements, depending on the requirements of the image.

Images should always include alt text for instances where the image is not loaded.

``` html
<img src="img/chuck-norris.jpg" alt="Chuck Norris.">
```

``` html
<picture>
	<source srcset="img/chuck-norris_tablet-up.jpg" media="(min-width: 768px)">
	<img src="img/chuck-norris.jpg" alt="Chuck Norris.">
</picture>
```





## Formatting

### General

Every new block level element should be on a new line, and indented correctly.

Inline elements do not have to be on a new line.

Tabs must be used for indentation, not spaces. Tab size can be changed based on the developer's text editor settings, spaces cannot.

``` html
<section class="section">
	<div class="inner">
		<h1>Title</h1>
		<p>Lorem ipsum dolor</p>
		<a href="#">More info</a>
	</div>
</section>
```

### Lowercase

All HTML code should be lowercase.

This does not apply to alt text or any content that will be displayed to users.

``` html
<a href="#">
	<img src="img/chuck-norris.jpg" alt="Chuck Norris.">
</a>
```

### Attribute Quotes

HTML attributes should use double quotes, not single quotes, around attribute values.

``` html
<input type="email" required>
```

### Comments

Make sure HTML is commented where necessary.

__Optionally__, if you want to add a closing comment after closing block level elements, feel free to do so.

For example:

``` html
<section class="section">
	<div class="inner">
		<h1>Title</h1>
		<p>Lorem ipsum dolor</p>
		<a href="#">More info</a>
	</div>
	<!-- /.inner -->
</section>
<!-- /.section -->
```
