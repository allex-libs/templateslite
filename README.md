# Templates Lite

The Templates Lite library exposes:
- the `process` function

##`process`
`process` processes a templatedescriptor and returns a String.

###templatedescriptor
May take one of several forms, which will result in different behavior of `process`.

###`templatedescriptor` in String form
If `templatedescriptor` is a String, `process` will immediately return `templatedescriptor` as the final result.

###`templatedescriptor` in `template`-`replacements` Object form
`templatedescriptor` may be an Object with 2 properties: `template` and `replacements`.

`template` must be a String.

####`replacements`
`replacements` may be an Object, in the form

```javascript
{
  token1: replacement1,
  ...
  tokenN: replacementN
}
```

In this case (which is the crucial case), `process` will traverse the `replacements` object, and in each (token-replacement) traversal pass, replace all exact (case-sensitive, full-word match) appearances of token with replacement.

token must be a String.
replacement may be a String or a `templatedescriptor` itself.

`replacements` may also be an Array of Objects in the (token-replacement) form.
In this case, `process` will process each (token-replacement) Object on the given `template`, in the order given by the `replacements` Array.


###`templatedescriptor` in `template`-`replacements`-`prereplacements` Object form
This case boils down to the `template`-`replacements` case, because `process` will use a "concatenation" of `prereplacements` (if such exists) and `replacements` (if such exists) as the Array of replacement Objects. 
