#### Module Node-Red pour S.A.R.A.H V5

### Inputs

`apikey`

**apikey** de votre compte **openweathermap** à renseigner dans la configuration du module

- `msg.payload.options.plugin`:

à utiliser avec un module **switch** pour rediriger vers le bon plugin

valeur de `out.action.plugin` du fichier **sarah-meteo.xml**

- `msg.payload.options.day`

nom du jours ou 0 pour aujourd'hui 1 pour demain et 2 pour après-demain

valeur de `out.action.day` du fichier **sarah-meteo.xml**

- `msg.payload.options.id`

**id** de la ville openweathermap (rechercher sur [http://openweathermap.org/find](http://openweathermap.org/find))

valeur de `out.action.id` du fichier **sarah-meteo.xml**

### Outputs

- `msg.payload`: renvoyé par win-sarah

- `msg.speak`: texte à lire par win-speak(ou autre)

- `msg.weather`: pour réutilisation eventuelle avec :"

--->`.tmin`: temperature min

--->`.tmax`: temperature max

--->`.humidity`: Pourcentage d'humiditée moyen

--->`.speedwind`: Vitesse du vent moyenne en km/h

--->`.prevision`: Prévision méteo

### Détails

module à associer aux modules SARAH

- win-sarah

- win-speak

Copier le fichier xml **./grammar/sarah-meteo.xml** dans le dossier grammar configuré sur le module **win-sarah**

dans le cas de plusieur plugin utiliser un module **switch** avec comme discriminant `msg.payload.options.plugin` renvoyé par **win-sarah** (ici **meteo**)

### Utilisation:

sarah quelle est la météo à Sannois

sarah quelle est la météo demain à Sannois

sarah quelle est la météo après demain à Sannois

sarah quelle est la météo lundi à Sannois
