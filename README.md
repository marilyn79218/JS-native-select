# Line - Native Select List

### Description
A demo project which imeplements suggestion list on HTML input tag without any libraries.

## New Features!
1.  All `<input>` in your HTML are implementable with my handler no matter they have an id attribute or not.
2.  When user focus/ click in the input field, the suggestion list showed.
3.  When user blur at the current input field or suggestion list area, the suggestion list is hided.
4.  When user select an app in the list with keyboard or mouse, the input value should be updated as its app name. Also, it should be also updated as the first priority in history list (which is stored in localStorage).
5.  When an app is removed from the history list, it will be putted back as the first priority in normal list.
6.  If there's a value in input field and it's being focused, the suggestion list only shows apps that match `Fuzzy Search` rule.
7.  The data in each suggestion list is independent from each other.


## Install

```bash
$ yarn
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

#### Data Template
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
