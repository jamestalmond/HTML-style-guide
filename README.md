# HTML-style-guide

A style guide for HTML at AO.com.

## Formatting

### Indentation

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

### Capitalization

All HTML code should be lowercase.

This does not apply to alt text or any content that will be displayed to users.

``` html
<a href="#">
	<img src="img/chuck-norris.jpg" alt="Chuck Norris">
</a>
```

## General rules

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
