#### Module Node-Red pour S.A.R.A.H V5

### Inputs

`apikey`

<dd>**apikey** de votre compte **openweathermap** à renseigner dans la configuration du module</dd>

- `msg.payload.options.plugin`:

<dd>à utiliser avec un module **switch** pour rediriger vers le bon plugin</dd>

<dd>valeur de `out.action.plugin` du fichier **sarah-meteo.xml**</dd>

- `msg.payload.options.day`

<dd>nom du jours ou 0 pour aujourd'hui 1 pour demain et 2 pour après-demain</dd>

<dd>valeur de `out.action.day` du fichier **sarah-meteo.xml**</dd>

- `msg.payload.options.id`

<dd>**id** de la ville openweathermap (rechercher sur [http://openweathermap.org/find](http://openweathermap.org/find))</dd>

<dd>valeur de `out.action.id` du fichier **sarah-meteo.xml**</dd>

### Outputs

- `msg.payload`: renvoyé par win-sarah

- `msg.speak`: texte à lire par win-speak(ou autre)

- `msg.weather`: pour réutilisation eventuelle avec :"

<dd>--->`.tmin`: temperature min</dd>

<dd>--->`.tmax`: temperature max</dd>

<dd>--->`.humidity`: Pourcentage d'humiditée moyen</dd>

<dd>--->`.speedwind`: Vitesse du vent moyenne en km/h</dd>

<dd>--->`.prevision`: Prévision méteo</dd>

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