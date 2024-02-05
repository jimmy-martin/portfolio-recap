const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require('path');
const conf = require('../config/conf');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: conf.GMAIL_USER,
        pass: conf.GMAIL_PASS,
      },
    });
  }

  loadTemplate(data) {
    const filePath = path.join(__dirname, '../templates/email.html');
    const file = fs.readFileSync(filePath, 'utf8');
    const template = file
      .replace(
        /{{date}}/g,
        new Date().toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      )
      .replace('{{totalBalanceUsd}}', `$${data.totalBalanceUsd.toFixed(2)}`)
      .replace('{{totalBalanceEur}}', `${data.totalBalanceEur.toFixed(2)}€`)
      .replace('{{portfolioItems}}', this.generatePortfolioItems(data.balance));

    return template;
  }

  generatePortfolioItems(balance) {
    const balanceHtml = balance
      .map((item) => {
        return `<tr>
                    <td>${item.symbol}</td>
                    <td>${item.chain}</td>
                    <td>$${item.usdValue.toFixed(2)}</td>
                    <td>$${item.actualPrice.toFixed(2)}</td>
                    <td>${item.amount}</td>
                </tr>`;
      })
      .join('');

    return `<table>
                <thead>
                    <tr>
                    <th>Symbole</th>
                    <th>Blockchain</th>
                    <th>Valeur (USD)</th>
                    <th>Prix Actuel</th>
                    <th>Quantité</th>
                    </tr>
                </thead>
                <tbody>
                    ${balanceHtml}
                </tbody>
            </table>`;
  }

  sendEmail(data) {
    const mailOptions = {
      from: conf.GMAIL_USER,
      to: conf.EMAIL_RECEIVER,
      subject:
        '🚀 Crypto Portfolio Recap du jour - ' +
        new Date().toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      html: this.loadTemplate(data),
    };

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Récapitulatif envoyé: ' + info.response);
      }
    });
  }
}

module.exports = EmailService;
