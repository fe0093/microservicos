const express = require("express");
const app = express();
app.use(express.json());
const axios = require("axios");
const baseConsulta = {};
const funcoes = {
    LojistaCriado : (lojista) => {
        baseConsulta[lojista.contador] = lojista;
    },
    ObservacaoCriada : (observacao) => {
        const observacoes = 
            baseConsulta[observacao.lojistaId]["observacoes"] || [];
        observacoes.push(observacao);
        baseConsulta[observacao.lojistaId]["observacoes"] = 
            observacoes;
    },
    ObservacaoAtualizada : (observacao) => {
        const observacoes = 
            baseConsulta[observacao.lojistaId]["observacoes"];
        const indice = observacoes.findIndex((o) => o.id === observacao.id);
        observacoes[indice] = observacao;
    },
};
app.get("/lojistas", (req, res) => {
    res.status(200).send(baseConsulta);
});
app.post("/eventos", (req, res) => {
    try {
        funcoes[req.body.tipo](req.body.dados);
    }catch(err){}
    res.status(200).send(baseConsulta);
});
app.listen(6000, async() => {
    console.log("Consultas. Porta 6000");
    const resp = await axios.get("http://localhost:8000/eventos");
    resp.data.forEach((valor,indice,colecao) => {
        try {
            funcoes[valor.tipo](valor.dados);
        }catch(err){}
    });
});