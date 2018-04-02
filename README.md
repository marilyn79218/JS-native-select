# Native Select List

### Description
A demo project which imeplements suggestion list on HTML input tag without any libraries.

## New Features!
1.  All `<input>` in your HTML are implementable with my handler whether they are having an id attribute or not.
2.  When user focus/ click in the input field, the suggestion list get showed.
3.  The suggestion list is hided when user blur at the current input field or suggestion list area.
4.  When user select an app in the list with keyboard or mouse, the input value should be updated as its app name. Also, it should also be updated as the first priority in history list (which is stored in localStorage).
5.  When an app is removed from the history list, it will be put into the normal list and being the first priority of them.
6.  If there's a value in input field and it's being focused, the suggestion list only shows those apps that match `Fuzzy Search` rule.
7.  All data in a suggestion list is independent from each other.


## Install

```bash
$ yarn
```

## HTML Example
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
  </head>
  <body>
    <p>Native Select</p>
    <!-- input without an id attribute is cool! -->
    <input type="text" placeholder="text">
    <input id="input-with-id" type="text" placeholder="text">
  </body>
</html>
```

## Other Data Source (Bonus point 3)

### Development
```bash
$ yarn start
```
The demo page will served on port 8080

or
```bash
$ endpoint=http://dev-url yarn start
```
If the endpoint is given as above, data will fetch from it.


### Production
```bash
$ endpoint=http://prod-url yarn build
```

##### Data Template
```js
{
  items: [
    {
      name: 'app name',
      logo: 'logo-url',
    },
  ],
}
```


