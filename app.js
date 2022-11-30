const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const details = require("./details.json");
const port = 3000;

const subjects = {
  site: {
    assunto: "Novo contato - Site",
    mensagem: "Adicione este contato à sua lista de emails",
    email: "arkambiental@arkambiental.com.br",
  },
  user: {
    assunto: "Bem vindo ao Arka Ambiental",
    mensagem: `
    <p>
    Nós da equipe Arka Ambiental, temos o prazer em ajudar você.
    É um prazer recebê-lo(a) aqui. Iremos atendê-lo(a) o mais breve possível;
    </p>    
    `,
  },
};

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`The server started on port ${port} !!!!!!`);
});

app.get("/", (req, res) => {
  res.send(
    "<h1 style='text-align: center'>Bem Vindo à api de email da Arka Ambiental<br><br>😃👻😃👻😃👻😃👻😃</h1>"
  );
});

app.post("/sendmail", (req, res) => {
  console.log("request came");
  let user = req.body;
  sendMail(user, (info) => {
    console.log(`O Email foi enviado 😃`);
    res.send(info);
  });
});

async function sendMail(user, callback) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: details.email,
      pass: details.password,
    },
  });

  let mailOptionsSite = {
    from: '"Arka Ambiental"<www.arkambiental.com.br/>', // sender address
    to: subjects.site.email, // list of receivers
    subject: "Nova Mensagem do Site 👻", // Subject line
    html: `<h1>Mensagem recebida de ${user.name}.</h1><br>
    <h4>Dados do Contato</h4>
    <p>Nome: ${user.name}</p>
    <p>E-Mail: ${user.email}</p>
    <p>Assunto: ${subjects.site.assunto}</p>
    <p>Mensagem: ${subjects.site.mensagem}</p>

    `,
  };

  let mailOptionsUser = {
    from: '"Arka Ambiental"<www.arkambiental.com.br/>', // sender address
    to: user.email, // list of receivers
    subject: subjects.user.assunto, // Subject line
    html: `<h1>Bem vindo ${user.name}.</h1><br>
    <h4>Olá ${user.name},</h4>

    <p>${subjects.user.mensagem}</p>

    `,
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptionsSite).then(() => {
    transporter.sendMail(mailOptionsUser);
  });
  callback(info);
}
