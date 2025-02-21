# QUESTIONS

## Why we should add `node_modules` to `.gitignore` so that it is not pushed to the repository? (2pts)

En général, nous n'ajoutons pas `node_modules` au repo, car tous les packages npm qui sont installé peuvent être retrouvé (avec leur version) dans le `package.json` et `package-lock.json`. Les rajouter au repo directement n'est pas très intéressant, parce qu'ils sont récupérables grâce à `npm install`.
Cela évite également que certains packages soient récupéré sur une machine qui n'a pas le même OS que celui qui a push le `node_modules`.

## Should we commit the package-lock.json file? (2pts)

Oui, car il sert à récupérer l'état des packages (versions) et leurs sous-dépendances. Il nous permet de nous assurer que nous récupérons le projet dans un état proche de celui push.

## Of what you can see of the backend [localhost:4000/api](http://localhost:4000/api), is it a RESTful API? (2pts)

L'api ne nous indique pas les liens pour accéder aux ressources connexes (HATEOAS), comme, les livre en eux même quand on appelle la liste de tous les livres, mais sinon elle respecte l'identification de ses données.

## What is the purpose of Frontend Frameworks like React, Angular, or Vue? (2pts)

Cela nous permet d'accélérer la production de notre application, de faciliter la maintenabilité du code, car la plupart des frameworks découpent le code en blocs qui peuvent facilement être remplacés ou réutilisés et de faciliter la collaboration, parce qu'en utilisant le même vframework, nous pouvons plus facilement nous y retrouver dans tous les blocs.
