# Form Register with LIFF Line made by React + React Bootstrap 

### Register Form Page

![S__11927622_re](https://user-images.githubusercontent.com/12761128/222344828-64cb2ac6-4d8c-4434-8791-3e523d08de87.jpg)

### Custom Paid Page

![S__11935748_re](https://user-images.githubusercontent.com/12761128/222347455-7ed67423-9d38-4f28-8924-26ecba598fea.jpg)

### Survey Page

![S__11935749_re](https://user-images.githubusercontent.com/12761128/222347496-7f6fb0c7-ee6c-4555-8e77-a19896f7d23a.jpg)

### Forbidden Page

![messageImage_1677738012296_re](https://user-images.githubusercontent.com/12761128/222347529-91891e95-2dd4-4f1f-a734-feb1ae28900f.jpg)

## Develop

when clone this repo, command this
```javascript
    npm install
```
and run this for developing mode
```javascript
    npm run dev
```

## Production
you need to change LIFF ID in .env file, you can find LIFF ID from [LINE DEVELOPER CONSOLE](https://developers.line.biz/console)
```javascript
    // .env file
  VITE_LIFF_ID=1657******-******vD //Register Form Page
  VITE_LIFF_ID_2=1657******-******4D //Custom Paid Page
  VITE_LIFF_ID_SURVEY=1657******-******JY //Survey Page
```
and rebuild project again
```javascript
  npm run build
```
dist folder will appear, so you can deploy this folder on server

**Happy Coding**
