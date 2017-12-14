# AO Sass FlexGrid

A grid that works! \\(\^_^)/

# Fully sassy customizable!

  - Define custom class names, breakpoint, gutter spaces
  - Define the items behaviour directly from the parent container
  - No flex fallbacks in 1 minute 
  - Mobile first (obviously :V )

# Customizable options!

Reachable from _flex-grid.scss

| Sass Variable | Description | Type | Example |
| ------ | ------ | ------ | ------ |
| `$flexContainer` | Class name for AO grid containers | `STRING` (with no marks) | `flex-container` |
| `$flexItem` | Class name for for AO grid children | `STRING` (with no marks) | `flex-item` |
| `$maxCol` | Max columns value | `INTEGER` (with no marks) | `12` |
| `$defaultGutter` | Default Gutter (overritten by specific breakpoint gutter values) | `PIXELS`/`REM` | `15px` |
| `$noFlexClass` | Fallback class name (see Browser Compatibility below) | `STRING` (with no marks) | `no-flexwrap` |
| `$breakpoint-list` | See below | `LIST` | See below |

### Breakpoints Definition

Here's an example of breakpoint definition:

```less
$breakpoint-list: (
    ( 768px,  8px,   tab),
    ( 1024px, 16px,  des),
    ( 1200px, 20px,  ube)
);
```

As you can see, each breakpoint is defined using a list of different values:

```
  Current breakpoint min width (px)
      \
       \                 Breakpoint slug (string with no marks)
        \               /
     ( 768px,  8px,   tab) 
               /
              /
   Current breakpoint gutters width (px/rem)
```

The slugs will be used later in this way (see the chapter below):

```html
<div class="flex-container cont-tab-6 cont-ube-3"> ... </div>
```

### How it works

#### Defining all the widths from the parent container

Here's an example of a 12 col based grid with multiple element of the same width: 

```html
    <div class="flex-container cont-tab-6 cont-ube-3">
        <div class="flex-item">
        </div>
        <div class="flex-item">
        </div>
        <div class="flex-item">
        </div>
        <div class="flex-item">
        </div>
    </div>
```

Let's give a look to the container class names:

```html
flex-container cont-tab-6 cont-ube-3
```

Each AO flex grid container should be defined as such using a specific class name.
By default it is: `flex-container`

but it could be replaced changing the value of the related Sass Variable (please see above).
In addiction you could specify the children width directly from the container.

```html
cont-tab-6 cont-ube-3
```

An item with these class will have the behavior below

| Viewport | Element width |
| ------ | ------ |
| `mobile` | `100%` |
| `tablet` | `6 / max column` |
| `desktop` | `6 / max column` |
| `uber` | `3 / max column` |


#### Specifing the width directly on the element

Let's take the previous example with some little amends


```html
    <div class="flex-container item-tab-4 item-ube-3">
        <div class="flex-item">
        </div>
        <div class="flex-item">
        </div>
        <div class="flex-item">
        </div>
        <div class="flex-item item-tab-6 item-ube-3">
        </div>
        <div class="flex-item item-tab-6 item-ube-3">
        </div>
    </div>
```
The `item-` prefix is used in order to override a behavior previously defined on a parent element.


### Modifiers

#### Containers modifiers

`in progress...`

#### Children modifiers

`in progress...`