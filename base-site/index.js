const fs = require('fs');
const yts = require('yt-search');
const express = require('express');
const app = express();
const { ytmp4, ytmp3 } = require('./lib/y2mate')
const { palavrasANA, quizanime, quizanimais} = require('./lib/jogos')
const { pinterestVideoV2 } = require('./lib/pinterest');
var { igstory} = require('./lib/scraper.js');
var { color } = require('./lib/color.js')
const apiKeysFile = fs.readFileSync('./keys.json');
const keyprem = JSON.parse(apiKeysFile);
var criador = "Elias Modder Ofc" 
var whatsapp = "5544920016171"
///EXEMPLO DE COMO USAR O EXPTEMP = 2024-01-21T12:60:00Z OU SEJA ELE IRA EXPIRAR NO DIA 21/01/2024 AS 12:60:00
app.get('/', function(req, res){
    res.sendFile(__dirname + "/public/index.html")
});

app.get('/resetapi', function(req, res){
    res.sendFile(__dirname + "/public/api.html")
});

app.get('/dono', function(req, res){
    res.sendFile(__dirname + "/public/admin.html")
});

app.get('/info_dono', function(req, res){
    res.sendFile(__dirname + "/public/info_criador.html")
});

app.get('/index.css', function(req, res){
    res.sendFile(__dirname + "/css/index.css")
});

app.get('/index2.css', function(req, res){
    res.sendFile(__dirname + "/css/index2.css")
});

app.get('/audio', function(req, res){
    res.sendFile(__dirname + "/audio/elias.mp3")
})

function ApiKeyAut(req, res, next) {
const apikey = req.query.apikey;
const ApiKeyB = keyprem.find(key => key.apikey === apikey);
if (!apikey) {
return res.status(401).json({ message: '⚠️ falta do parâmetro apikey - coloque o paramentro apikey.' });
}
if (!ApiKeyB) {
return res.status(401).json({ message: 'SEJA BEM VINDO(A) AO YASMIM APIs ✔️\n\n VOCÊ NÃO POSSUI APIKEY, ENTRE EM CONTATO COM O ELIAS MODDER \n👤wa.me/5544920016171👤' });
}
const now = new Date();
const TempoDeIns = new Date(ApiKeyB.TempoDeIns);
if (now > TempoDeIns) {
return res.status(401).json({ message: '⌚ apikey expirado - Entre em contato com o Elias Modder= wa.me//5544920016171 para solucionar o problema.' });
}
next();
}

/*
DONO
*/
app.get('/api/addapikey', async (req, res) => {
apikeyadd = req.query.apikeyadd
exptemp = req.query.exptemp
senha = req.query.senha
senhaadm = ["elias_grubert_2023"]
if (!apikeyadd) { return res.status(401).json({ message: '⚠️ falta do parâmetro apikeyadd - coloque o paramentro apikeyadd.' });}
if (!exptemp) { return res.status(401).json({ message: '⚠️ falta do parâmetro exptemp - coloque o paramentro exptemp.' });}
if (!senha) { return res.status(401).json({ message: '⚠️ falta do parâmetro senha - coloque o paramentro senha.' });}
if(!senha.includes(senhaadm))return res.json({status:false,msg:'Senha inválida!!! koe parceiro, se não for adm vaza daqui 🧐'})
const now = new Date();
keyprem.push({
apikey: apikeyadd,
Tempo: exptemp,
});
fs.writeFileSync('./keys.json', JSON.stringify(keyprem))
res.json({ apikeyadd, exptemp });
});

app.get('/api/delapikey', (req, res) => {
const apikeydel = req.query.apikeydel;
const senha = req.query.senha;
const senhaadm = ["elias_grubert_2023"]
if (!apikeydel) {
return res.status(401).json({ message: '⚠️ Falta do parâmetro apikeydel - Informe o parâmetro apikeydel.' });
}
if (!senha) {
return res.status(401).json({ message: '⚠️ Falta do parâmetro senha - Informe o parâmetro senha.' });
}
if (!senhaadm.includes(senha)) {
    return res.json({ status: false, msg: 'Senha inválida!!! Apenas administradores podem executar esta ação.' });
}
const keyIndex = keyprem.findIndex(key => key.apikey === apikeydel);
if (keyIndex === -1) {
return res.status(404).json({ message: 'API Key não encontrada.' });
}
keyprem.splice(keyIndex, 1);
fs.writeFileSync('./keys.json', JSON.stringify(keyprem));
res.json({ message: 'API Key removida com sucesso.' });
});

app.get('/api/keyerrada',(req, res) => {
var apikey = req.query.apikey;
var ITC = keyprem.map(i => i?.apikey)?.indexOf(apikey);
if(ITC < 0) {
return res.json({keyprem:' ❌ Sua apikey é invalida!! ❌'})
} else {return res.json({keyprem:`🔑 Sua apikey está 100% ✅ expira em: ${keyprem[ITC]?.Tempo}`})}})

//***************PESQUISA*************************\\ 
app.get('/pesquisa/play', ApiKeyAut, async (req, res, next) =>  {
query = req.query.query
if(!query)return res.json({status:false, resultado:'Cade o parametro query??'  }) 
var apikey = req.query.apikey
var ITC = keyprem.map(i => i?.apikey)?.indexOf(apikey);
console.log(color(' │ APIKEY:'  + ` ${apikey}\n`,'orange'))
try {
zan = await yts(query)
res.json({
status: true,
criador: `${criador}`,
whatsapp: `${whatsapp}`,
Title: zan.all[0].title,
Thumb: zan.all[0].image,
Description : zan.all[0].description,
Duration: zan.all[0].timestamp,
Viewer: zan.all[0].views, 
Author : zan.all[0].author.name,
Channel : zan.all[0].author.name,
Link: zan.all[0].url,
})
} catch (err) {
res.json({resultado: `error`})
};
})

app.get('/pesquisa/ytplaymp3', ApiKeyAut, async (req, res, next) => {
	var nome = req.query.nome;
	var apikey = req.query.apikey;
var ITC = keyprem.map(i => i?.apikey)?.indexOf(apikey);
     if (nome === undefined) return res.status(404).send({
        status: 404,
        message: `insira o parâmetro nome`
    });
    console.log(color(' • APIKEY:'  + ` ${apikey}\n`,'orange'))
let yts = require("yt-search")
let pesquisa = await yts(nome)
let url = pesquisa.all[Math.floor(Math.random() * pesquisa.all.length)]
ytmp3(url.url).then(data => {
 if (!data) return res.json(loghandler.noturl)
	res.json({
	    status: true,
	    criador: `${criador}`,
	    whatsapp: `${whatsapp}`,
	    resultado: data
	})
	
})
})

app.get('/pesquisa/ytplaymp4', ApiKeyAut, async (req, res, next) => {
	var nome = req.query.nome
	var apikey = req.query.apikey;
var ITC = keyprem.map(i => i?.apikey)?.indexOf(apikey);
     if (nome === undefined) return res.status(404).send({
        status: 404,
        message: `insira o parâmetro nome`
    });
    console.log(color(' • APIKEY:'  + ` ${apikey}\n`,'orange'))
let yts = require("yt-search")
let pesquisa = await yts(nome)
let url = pesquisa.all[Math.floor(Math.random() * pesquisa.all.length)]
ytmp4(url.url).then(data => {
 if (!data) return res.json(loghandler.noturl)
	res.json({
	    status: true,
	    criador: `${criador}`,
	    whatsapp: `${whatsapp}`,
	    whatsapp: `${whatsapp}`,
	    resultado: data
	})
	
})
})

app.get('/pesquisa/videopinterest', ApiKeyAut, async(req, res, next) => {
    url = req.query.url;
    var apikey = req.query.apikey;
var ITC = keyprem.map(i => i?.apikey)?.indexOf(apikey);
    if(!url) return res.json({ status: false, criador: `${criador}`, messagem: `coloque o parametro url`})
    console.log(color(' • APIKEY:'  + ` ${apikey}\n`,'orange'))
    pinterestVideoV2(url).then(data => {
res.json({
    pesquisa: data})}).catch(e => {
        res.json({
            msg: `error`
        })})})

   //***************JOGOS*************************\\   
    app.get('/jogos/anagrama', ApiKeyAut, async (req, res) => {
   var apikey = req.query.apikey;
var ITC = keyprem.map(i => i?.apikey)?.indexOf(apikey);
console.log(color(' • APIKEY:'  + ` ${apikey}\n`,'orange'))
   random = palavrasANA[Math.floor(Math.random() * palavrasANA.length)]
   res.send(random)
   });  
       app.get('/jogos/quizanime', ApiKeyAut, async (req, res) => {
 var apikey = req.query.apikey;
var ITC = keyprem.map(i => i?.apikey)?.indexOf(apikey);
console.log(color(' • APIKEY:'  + ` ${apikey}\n`,'orange'))
     random = quizanime[Math.floor(Math.random() * quizanime.length)]
   res.send(random)
   });
   app.get('/jogos/quizanimais', ApiKeyAut, async (req, res) => {
  var apikey = req.query.apikey;
var ITC = keyprem.map(i => i?.apikey)?.indexOf(apikey);
console.log(color(' • APIKEY:'  + ` ${apikey}\n`,'orange'))
    random = quizanimais[Math.floor(Math.random() * quizanimais.length)]
   res.send(random)
   });   
  //―――――――――――――――――――――――――――――――――――――――――― ┏  FIM DOS JOGOS  ┓ ―――――――――――――――――――――――――――――――――――――――――― \\

app.listen(1709, function(){
        console.log('yasmim rodando na porta 1709')
});
///localhost:1709