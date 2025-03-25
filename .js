
const resultado = document.getElementById('resultado')
const resultado2 = document.querySelector('#resultado2')


let latitude = 0;
let longitude = 0;


function pegarLocalizacao(){

    if(navigator.geolocation){


        navigator.geolocation.getCurrentPosition(mostrarPosicao, mostrarErro,{
            enableHighAccuracy: true,
            timeout: 10000, 
            maximumAge: 0 
        })

    }else{
        resultado.innerText = 'Geolocalização não é suportada por este navegador'
    }
}

function mostrarErro(error){
    switch(error.code){
        case error.PERMISSION_DENIED:
            resultado.innerText = '🚫 O usuário negou o acesso a localização.';
            break;
        case error.POSITION_UNAVAILABLE:
            resultado.innerText = '❌ A localização não está disponível.';
            break;
        case error.TIMEOUT:
            resultado.innerText = '⏳ A solicitação expirou.';
            break;
        default:
            resultado.innerText = '⚠ Erro desconhecido.';
    }
}

function mostrarPosicao(posicao){
    console.log(posicao);
    latitude = posicao.coords.latitude;
    console.log(latitude);
    longitude = posicao.coords.longitude;
    console.log(longitude);
    resultado.innerHTML = `
    Latitude: ${latitude}<br>
    Longitude: ${longitude}<br>
    <a href="https://www.google.com.br/maps/@${latitude},${longitude},20z?entry=ttu" target='_blank'><h4> Ver no Google Maps</h4></a>
    `
}


async function buscarEndereco() {


    if (latitude === null || longitude === null) {
        resultado2.innerHTML = "⚠️ Primeiro obtenha as coordenadas!";
        return;
    }


    try {

        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=pt-br`;

a
        const resposta = await fetch(url);


        const dados = await resposta.json();
        console.log(dados);


        const endereco = dados.address;
        console.log(endereco);

        resultado2.innerHTML = `
    <h3>📍 Detalhes do endereço:</h3>
    País: ${endereco.country || "N/A"}<br>
    Estado: ${endereco.state || "N/A"}<br>
    Cidade: ${endereco.city || endereco.town || endereco.village || "N/A"}<br>
    Bairro: ${endereco.suburb || "N/A"}<br>
    Rua: ${endereco.road || "N/A"}<br>
    CEP: ${endereco.postcode || "N/A"}<br>
    <a href="https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}" target="_blank">
        <h4>🌍 Ver no OpenStreetMap</h4>
    </a>
`;


    } catch (erro) {
        resultado2.innerHTML = "❌ Erro ao buscar o endereço!";
        console.error("Erro ao buscar dados:", erro);
    };
}


let mapa = L.map('mapa').setView([-23.9828992, -48.8669184], 10);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mapa);