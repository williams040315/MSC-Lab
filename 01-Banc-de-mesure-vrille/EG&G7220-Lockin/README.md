## EG&G7220-Lockin

1. Importer dans node-red le EGG7220-NR.json et déployer le flux
2. Lancer le code python Python-connect-EGG7220-NR.py
3. Observer les données générées en temps rééel sur MatplotLib

![Données générées](https://github.com/williams040315/MSC-Lab/blob/main/01-Banc-de-mesure-vrille/EG%26G7220-Lockin/Figure_1.png)

Pour avoir les vrais données du Lockin il faut modifier le bloc fonctionnel `Send Python`:
* Ligne 8 output.payload.M = getRandomInt(1000) par output.payload.M = global.get('M'); 
* Ligne 9 output.payload.P = getRandomInt(1000) par output.payload.P = global.get('P') ;
