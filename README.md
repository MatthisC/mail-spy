# Mail-spy

Le projet consiste à détecter les ouvertures de mails sans avoir recours à une base de données. Pour le bon fonctionnement de l'application, le serveur doit être hébergé sur internet (ou sur le même réseau que la personne ouvrant le mail).

# Proof of concept

[https://mail-spy.herokuapp.com/](https://mail-spy.herokuapp.com/)

L'hébergement du projet est gratuit, cela peut entraîner des ralentissement, voir même le malfonctionnement (si la durée de connexion est trop longue). Il se peut aussi que le site ne soit plus atteignable car trop utilisé. Il vaut mieux essayer d'atteindre le site web en début de mois car les heures d'utilisation mensuelles sont limitées par les conditions d'utilisations d'heroku.

# Installation

`npm install`

`npm start`

# Utilisation

### Fonctionnement

Le principe est simple : comptabiliser le nombre de fois qu'une image est chargée sur le serveur. Il suffit ensuite d'ajouter l'image dans le mail. Quand il sera ouvert, l'image sera chargée sur le serveur et le compteur sera donc incrémenté.

### Créer un mail

Pour créer un nouveau mail à espionner, il suffit d'appuyer sur le bouton. Une nouvelle ligne sera ajoutée contenant l'URL de l'image à ajouter sur le mail.

### Ajouter une image sur le mail (Gmail)

Cliquer sur "Nouveau message", puis sur "Insérer une photo" (représenté par un logo avec une image). Un pop-up va s'ouvrir, il faut séléctionner l'onglet "Adresse Web (URL)", et coller l'adresse correspondante au mail.

### Ouverture du mail

Les données présentes sur la page sont actualisées automatiquement dès l'ouverture du mail. Dans la mesure où il n'y a pas de base de données, il ne **faut pas actualiser la page** (sinon la connexion client-serveur sera fermée, et tous les mails créés seront supprimés).