## EG&G7220-Lockin

J'utilise ici une technique de communication en websocket. Node-red communique avec le Lockin via le port série. Python commande Node-red pour démarrer, arrêter ou récupérer les données issues du Lockin par les tunnels en websockets.

## Lancement des programmes
1. Importer dans node-red le EGG7220-NR.json et déployer le flux
2. Lancer le code python Python-connect-EGG7220-NR-*.py

Voici à titre d'exemple les données générées en temps rééel sur MatplotLib (ici, pour l'exemple, purement aléatoire)

![Données générées](https://github.com/williams040315/MSC-Lab/blob/main/01-Banc-de-mesure-vrille/EG%26G7220-Lockin/Figure_1.png)

Pour lire les données de magnitude et de phase du Lockin il faut modifier le bloc fonctionnel `Send Python`:
* Ligne 8 output.payload.M = getRandomInt(1000) par output.payload.M = global.get('M') ; 
* Ligne 9 output.payload.P = getRandomInt(1000) par output.payload.P = global.get('P') ;

## Notes techniques: 
Il est important de croiser le câble série entre le Lockin et le PC comme le mentionne la documentation constructeur [Appendix D, Cable Diagrams](https://github.com/williams040315/MSC-Lab/blob/main/01-Banc-de-mesure-vrille/Docs/manual-7220-EG%26G%5B35%5D.pdf)

------------------------------------------------------------------------------------------------------------------------------------------
[Williams BRETT](williams.brett@univ-paris-diderot.fr) | [MSC](http://www.msc.univ-paris-diderot.fr/)
