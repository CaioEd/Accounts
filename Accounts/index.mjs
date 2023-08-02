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
            deposit()
        } else if(action === 'Consultar Saldo'){
            getAccountBalance()
        } else if(action === 'Sacar') {
            withdraw()
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

//  FUNÇÃO DEPÓSITO

function deposit() {
  inquirer.prompt([
    {
      name: 'accountName',
      message: 'Digite o nome da sua conta: '
    }
  ]).then((answer) => {
    const accountName = answer['accountName']

    if(!checkAccount(accountName)){   // VERIFICAR SE A CONTA EXISTE ANTES DE DEPOSITAR
      return deposit()
    }

    inquirer.prompt([
      {
        name: 'amount',
        message: 'Quanto você deseja depositar ? '
      }
    ]).then((answer) =>{
      const amount = answer['amount']

      // ADICIONAR VALOR(AMOUNT)
      addAmount(accountName, amount)
      operation()
    })

  })
}

function checkAccount(accountName) {    // VERIFICA SE A CONTA DIGITADA EXISTE 
    if(!fs.existsSync(`accounts/${accountName}.json`)) {
      console.log(chalk.bgRed.black('Está conta não existe, digite outro nome!'))
      return false
    }

    return true
}

function addAmount(accountName, amount){
  const accountData = getAccount(accountName)   // DADOS DA CONTA

  if(!amount){    // MENSAGEM EXIBIDA SE O USUÁRIO NÃO DIGITAR NENHUM VALOR 
    console.log(chalk.bgRed.black('Ocorre um erro, tente novamente mais tarde!'))
    return deposit()
  }

  accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)    // SOMA A QUANTIA DIGITADA + O VALOR DA CONTA

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function(err) {
      console.log(err)
    },
  )

  console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`))
}

function getAccount(accountName){   // PEGA OS DADOS DA CONTA
  const accountJson = fs.readFileSync(`accounts/${accountName}.json`, {   // LE OS DADOS DO ARQUIVO
    encoding: 'utf-8',
    flag: 'r'
  })

  return JSON.parse(accountJson)
}

// CONSULTAR SALDO

function getAccountBalance() {
  inquirer.prompt([
    {
      name:'accountName',
      message:'Qual o nome da sua conta ? '
    }
  ]).then((answer) =>{
    const accountName = answer['accountName']

    if(!checkAccount(accountName)) {
      return getAccountBalance()
    }

    const accountData = getAccount(accountName)
    console.log(chalk.bgBlue.black(`O saldo atual da sua conta é de R$${accountData.balance}`))

    operation()
  })
}

// SACAR

function withdraw() {
  inquirer.prompt([
    {
      name:'accountName',
      message:'Qual o nome da sua conta ? '
    }
  ]).then((answer) => {
    const accountName =  answer['accountName']

    if(!checkAccount(accountName)) {
      return withdraw()
    }

    inquirer.prompt([
      {
        name: 'amount',
        message: 'Quanto você deseja sacar ?'
      }
    ]).then(answer => {
      const amount = answer['amount']

      removeAmount(accountName, amount)
    })

  })
}

function removeAmount(accountName, amount){
  const accountData = getAccount(accountName)

  if(!amount){    // SE O USUÁRIO NÃO DIGITAR EXIBE MENSAGEM DE ERRO 
    console.log(chalk.bgRed.black('Ocorreu um erro tente novamente mais tarde!'))
    return withdraw()
  }

  if(accountData.balance < amount){
    console.log(chalk.bgRed.black('Valor indisponível para saque!'))
    return withdraw()
  }

  accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)
  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function(err) {
      console.log(err)
    },
  )

  console.log(chalk.green(`Saque de R$${amount} realizado com sucesso!`))
  operation()
}