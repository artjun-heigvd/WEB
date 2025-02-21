# Hello, World!

L'objectif de ce laboratoire est d'installer l'environnement de développement et de se familiariser avec GitHub Classroom.
C'est un travail individuel d'introduction qui n'est pas noté.

## Prérequis

- [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) doit être installé sur votre machine.

## Guide

_Hautement inspiré du guide [Downloading and installing Node.js and npm - docs.npmjs.com](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)._

### Setup the environment

`nvm` vous permet d'installer et de gérer plusieurs versions de Node.js (et npm). Au moment de la rédaction de ce guide, la dernière version à long terme (LTS) est Node.js v20.x.x.

Utilisez les commandes suivantes pour installer et définir une version de Node.js.

```sh
# Visualize all available versions
nvm ls-remote

# Install a Node.js version (latest LTS version)
nvm install v20

# Set the Node.js version for the current terminal
nvm use v20

# Set the Node.js version globally
nvm alias default v20

# Display the Node.js and npm versions
node --version
npm --version
```

Vous pouvez maintenant passer d'une version à l'autre de Node.js.

## Copier le code source du laboratoire

Commencez par cloner ce repository sur votre machine à l'aide de `git`.

Ensuite, dans le dossier de l'exercice, exécutez la commande `node hello.js` dans le terminal, puis modifiez le fichier `hello.js` de manière à ce qu'il imprime `Hello World!`, puis commit sur GitHub.
GitHub Classroom effectue des vérifications automatiques et devrait vous donner un premier point.

Toujours dans le dossier de l'exercice, exécutez la commande `node server.js` dans le terminal.
Ouvrez ensuite le navigateur à l'adresse [http://localhost:3000/](http://localhost:3000).
Lisez attentivement le code de manière à identifier clairement les parties qui s'exécutent sur le serveur et celles qui s'exécutent dans le navigateur.

## Initialiser l'environnement de développement

Initialisez maintenant une application JavaScript à l'aide de la commande `npm init` et complétez les informations demandées par l'utilitaire de configuration.

Installez ensuite une dépendance de développement avec la commande `npm install eslint --save-dev`. 
Cette commande installe un [linter](https://en.wikipedia.org/wiki/Lint_(software)) qui vous aidera à corriger le programme `server.js`.
Notez l'apparition du fichier `package.json` (configuration) et du dossier `node_modules/` (dépendances) à la racine du projet.

Exécutez la commande `npx eslint --init` à la racine du projet et complétez les informations demandées par l'utilitaire de configuration ([configuration recommandée](./configuration-eslint.md)). La commande `npx eslint server.js` devrait afficher une liste de problèmes.

Ajouter la configuration suivante au fichier `.eslintrc.js` pour désactiver la règle `no-console`:
```json
"rules": {
        "no-console": "off"
    }
```


## Corriger le projet à l'aide de Visual Studio Code

Pour vous assister dans les corrections, installez [Visual Studio Code](https://code.visualstudio.com/) et l'extension ESLint.
Utilisez les recommandations du linter et l’outil de formatage pour corriger le projet et commitez  sur GitHub. 
Si le linter n'affiche plus aucun problème, GitHub Classroom devrait vous accorder les points restant pour ce travail.
