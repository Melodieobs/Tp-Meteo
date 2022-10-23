let recherche = document.querySelector('#recherche');
let text = document.querySelector('#text')
let lieu = document.querySelector('p:first-of-type')


let date = document.querySelector('#time')
let temperature = document.querySelector('#temp')
let humidity = document.querySelector('#humidity')
let prec = document.querySelector('#Precipite')

let sect3 = document.querySelector('.containerMeteo')
let image = document.querySelector('#sect2 img')

let but = document.querySelector('button')


recherche.addEventListener('click', rech => {
    rech.preventDefault();
    let ville = text.value
    lieu.innerText = ville
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '3ad7dd0c07msh2742f2ccf0e9ca8p1adf50jsn9764411a9e5d',
            'X-RapidAPI-Host': 'spott.p.rapidapi.com'
        }
    };
    fetch(`https://spott.p.rapidapi.com/places/autocomplete?limit=10&skip=0&language=%20fr&country=FR&q=${ville}`, options).then(response => {
        if (response.ok === true) {
            response.json().then(donnee => {
                console.log(donnee)
                donnee.forEach(element => {
                    console.log(element.coordinates.latitude)
                    console.log(element.coordinates.longitude)

                    let latitude = element.coordinates.latitude;
                    let longitude = element.coordinates.longitude;

                    fetch(` https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto`).then(rep => {
                        if (rep.ok === true) {
                            rep.json().then(data => {
                                const d = new Date();
                                let heure = d.getHours();

                                console.log(Date())
                                console.log(d.getDate())

                                let jour = d.getDate()

                                console.log(data.hourly.temperature_2m[jour])
                                console.log(data.hourly.time[jour])

                                let temp = data.hourly.temperature_2m[heure]
                                let time = data.hourly.time[heure]
                                let humi = data.hourly.relativehumidity_2m[heure]
                                let precText = data.hourly.precipitation[heure]

                                date.innerText = time
                                temperature.innerText = `${temp}°C`
                                humidity.innerText = `${humi}%`
                                prec.innerText = `${precText}%`

                                let src = 'https://www.freeiconspng.com/thumbs/weather-icon-png/weather-icon-png-8.png'

                                if (temp > 14) {
                                    src = 'https://www.freeiconspng.com/thumbs/weather-icon-png/weather-icon-10.png'
                                } else if (temp >= 19) {
                                    src = 'https://www.freeiconspng.com/thumbs/weather-icon-png/weather-icon-png-8.png'
                                } else if (temp <= 3) {
                                    src = 'https://w7.pngwing.com/pngs/546/46/png-transparent-weather-forecasting-severe-weather-storm-weather-free-text-heart-logo-thumbnail.png'
                                } else if (temp <= 0) {
                                    src = 'https://static.vecteezy.com/ti/vecteur-libre/p1/2621215-meteo-hiver-nuages-et-flocons-neige-saison-froid-ligne-et-remplissage-style-gratuit-vectoriel.jpg'
                                }
                                image.setAttribute('src', src)

                                but.addEventListener('click', e => {
                                    if (but.innerText === 'Afficher la météo de la journée') {
                                        for (i = 0; i <= 24;) {
                                            i = i + 3;
                                            but.innerText = 'Retirer la météo de la journée'

                                            let div = document.createElement('div');

                                            temp = data.hourly.temperature_2m[heure + i]
                                            time = data.hourly.time[heure + i]
                                            humi = data.hourly.relativehumidity_2m[heure + i]
                                            precText = data.hourly.precipitation[heure + i]

                                            let src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Sun-soleil2.svg/220px-Sun-soleil2.svg.png'

                                            if (temp > 14) {
                                                src = 'https://www.freeiconspng.com/thumbs/weather-icon-png/weather-icon-10.png'
                                            } else if (temp < 14) {
                                                src = 'https://www.freeiconspng.com/thumbs/weather-icon-png/weather-icon-png-8.png'
                                            } else if (temp <= 3) {
                                                src = 'https://w7.pngwing.com/pngs/546/46/png-transparent-weather-forecasting-severe-weather-storm-weather-free-text-heart-logo-thumbnail.png'
                                            } else if (temps <= 0) {
                                                src = 'https://static.vecteezy.com/ti/vecteur-libre/p1/2621215-meteo-hiver-nuages-et-flocons-neige-saison-froid-ligne-et-remplissage-style-gratuit-vectoriel.jpg'
                                            }

                                            div.innerHTML = `
                                    <img src='${src}'alt='Soleil'>
                                    <p>${time}<p>
                                    <p>${temp}°C<p>
                                    <p>${humi}%<p>
                                    <p>${precText}%<p>
                                    `
                                            sect3.append(div);
                                        }
                                    } else {
                                        but.innerText = 'Afficher la météo de la journée'
                                        let div = document.querySelectorAll('.containerMeteo div')
                                        div.forEach(el => {
                                            el.remove()
                                        })
                                    }
                                })

                            }).catch(err => {
                                console.log(err)
                            })
                        }
                    })
                });
            })
        }
    }).catch(err => console.error(err));
})

