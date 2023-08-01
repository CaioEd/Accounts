// MÓDULOS EXTERNOS
import inquirer from 'inquirer'
import chalk from 'chalk'

// MÓDULOS INTERNOS
import fs from 'fs'

//

console.log(chalk.bgGreenBright.black('Seja Bem-Vindo ao Accounts!'))

operation()

function operation() {
    
    inquirer
      .prompt([     // OPÕES PARA O USUÁRIO
        {
          type: 'list',
          name: 'action',
          message: 'O que você deseja fazer?',
          choices: [
            'Criar conta',
            'Consultar Saldo',
            'Depositar',
            'Sacar',
            'Sair',
          ],
        },
      ])
      .then((answer) => {
        const action = answer['action']
  
        if (action === 'Criar conta') {     // CHAMA UMA FUNÇÃO DE ACORDO COM A ESCOLHA DO USUÁRIO
          createAccount()
        } else if(action === 'Depositar') {

        } else if(action === 'Consultar Saldo'){

        } else if(action === 'Sacar') {

        } else if(action === 'Sair') {
          console.log(chalk.bgGreen.black('Obrigado por usar o Accounts!'))
          process.exit()
        }
      })
  }
  
  // create user account
  function createAccount() {
    console.log(chalk.bgGreen.black('Parabéns por escolher nosso banco!'))
    console.log(chalk.green('Defina as opções da sua conta a seguir'))
  
    buildAccount()
  }
  
  function buildAccount() {     // QUANDO O USUÁRIO ESCOLHER 'CRIAR CONTA' ESSA FUNÇÃO É CHAMADA 
    inquirer
      .prompt([
        {
          name: 'accountName',
          message: 'Digite um nome para a sua conta:',
        },
      ])
      .then((answer) => {
        const accountName = answer['accountName']
        console.info(accountName)

        if(!fs.existsSync('accounts')){   // SE A PASTA NÃO EXISTIR CRIA UMA
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountName}.json`)){    // SE ESSE NOME CONTA JÁ EXISTER EXIBE DE ERRO E CHAMA A FUNÇÃO NOVAMENTE
          console.log(chalk.bgRed.black('Está conta já existe, escolha outro nome!'))
          buildAccount()
          return
        }

        fs.writeFileSync(`accounts/${accountName}.json`,  // CRIA ARQUIVO DA CONTA
          '{"balance": 0}',
          function (err) {console.log(err)}
        )

        console.log(chalk.green('Parabéns, sua conta foi criada!'))
        operation()
      })
      .catch((err) => console.log(err))
  }