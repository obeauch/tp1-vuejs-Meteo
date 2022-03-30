//Salut
const app = {
    components: {
    },

    data() {
        return {
            ville: "",
            pays: "",
            id: "d5b3477c5bde5f70d105ad41a4f546af",
            lat: "",
            lon: "",
            formulaire: 1,
            informations: [],
            icon: "",
            vent: "",
            heure_leve: "",
            heure_couche: "",
            neige: "",
            pluie: "",
            precipitations: "1h",

        }
    },

    mounted() {

    },

    methods: {

        /**
         * Fait une recherche de la ville dans l'API en fonction de
         * la latitude et de la longitude, puis affiche la météo (afficheMeteo())
         * en fonction de cette ville
         */
        rechercheVille() {
            const options = {
                method: "GET",
                cors: true,
            }

            const param_id = "appid=" + this.id
            const param_ville = "q=" + this.ville + "," + this.pays
            const url = "http://api.openweathermap.org/geo/1.0/direct?"

            fetch(url + param_ville + "&" + param_id, options).then(resp => resp.json()).then(data => {
                this.lat = data[0].lat
                this.lon = data[0].lon
                this.afficherMeteo()

            })
        },

        /**
         * On inclus la latitude et longitude, ainsi que la langue et l'unité de mesure
         * dans l'url et on place les informations recueillies dans un data (informations)
         */
        afficherMeteo() {
            const options = {
                method: "GET",
                cors: true,
            }

            const param_id = "appid=" + this.id
            const param_lat = "lat=" + this.lat
            const param_lon = "lon=" + this.lon
            const param_metric = "&units=metric"
            const param_langue = "&lang=fr"
            const url = "http://api.openweathermap.org/data/2.5/weather?"


            fetch(url + param_lat + "&" + param_lon + "&" + param_id + param_metric + param_langue, options).then(resp => resp.json()).then(data => {
                console.log(data)
                this.informations = data
                this.formulaire = 0
                this.icon = data.weather[0].icon

                //Cette partie permet d'avoir le levé et le couché du soleil partout, mais n'est pas dynamique (à revoir)
                this.heure_leve = this.informations.sys.sunrise + this.informations.timezone + 14400
                this.heure_couche = this.informations.sys.sunset + this.informations.timezone + 14400

                this.directionVent()
                this.precipitationNeige()
                this.precipitationPluie()

            })
        },

        //On replace les valeurs par défaut lorsqu'on revient au formulaire d'accueil
        deconnexion() {
            this.formulaire = 1
            this.ville = ""
            this.pays = ""
            this.neige = ""
            this.pluie = ""
        },

        //On sépare un cercle (360°) en quatre et on place une valeur (this.vent)
        //en fonction de l'angle obtenu
        directionVent() {
            if (this.informations.wind.deg >= 45 && this.informations.wind.deg < 135) {
                this.vent = "de l'est"
            } else if (this.informations.wind.deg >= 135 && this.informations.wind.deg < 225) {
                this.vent = "du sud"
            } else if (this.informations.wind.deg >= 225 && this.informations.wind.deg < 315) {
                this.vent = "de l'ouest"
            } else {
                this.vent = "du nord"
            }
        },

        //La date obtenue à partir du unix_timestamp (1 janvier 1970)
        //On retourne une valeur(ex: 10h37) en fonction d'un paramètre reçu
        dates(t) {
            let unix_timestamp = t
            // multiplier par 1000, car javascript en millisecondes
            let date = new Date(unix_timestamp * 1000);
            let hours = date.getHours();
            let minutes = "0" + date.getMinutes();
            let formattedTime = hours + 'h' + minutes.substr(-2);

            return formattedTime
        },

        //Si il y a une valeur dans l'API à la valeur snow on place cette valeur 
        // dans this.neige que l'on récupère dans index.html class="precipitation-neige"
        precipitationNeige() {
            if (this.informations.snow) {
                this.neige = this.informations.snow[this.precipitations]
            }
        },

        //Si il y a une valeur dans l'API à la valeur rain on place cette valeur dans 
        // dans this.pluie que l'on récupère dans index.html class="precipitation-pluie"
        precipitationPluie() {
            if (this.informations.rain) {
                this.pluie = this.informations.rain[this.precipitations]
            }
        },

        //Place la première lettre du texte mis en paramètre, en majuscule
        capital(text) {
            const upper = text.charAt(0).toUpperCase() + text.substring(1);
            return upper
        },
    }
}

Vue.createApp(app).mount("#app")