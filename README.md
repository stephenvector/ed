# ed

A simple editor

[![.github/workflows/main.yml](https://github.com/stephenvector/ed/actions/workflows/main.yml/badge.svg)](https://github.com/stephenvector/ed/actions/workflows/main.yml)

```javascript
// Merge inline elements so that they don't overlap
// example:
//  link: 3,10
//  italic: 7,15
//  underline: 2,12
//
// ...llllllll........
// .......iiiiiiiii...
// ..uuuuuuuuuuu......
//
// ...llllllll | ........
// .......iiii | iiiii...
// ..uuuuuuuuu | uu......
//
// ... | llll | llll | .. | ......
// ... | .... | iiii | ii | iii...
// ..u | uuuu | uuuu | uu | ......
```

If you have a string like:

```
this is a string
```

And you apply an inline styling to it from 0 to 4, say 'italic', you'd get:

```
<em>this </em>is a string
```

But we should not include the space, so the actual added range should be 0 to 3.
