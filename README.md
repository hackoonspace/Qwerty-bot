# Bot do Qwerty

<p align="center">
<img src="https://github.com/hackoonspace/Qwerty-bot/blob/main/images/qwerty.png" width="200" height="200">
</p>

Bot para gerir e ofercer diversos sistemas e ferramentas para o servidor do Discord do HackoonSpace. 

Baseado no mascote da própria entidade, o guaxinim Qwerty.

Contribuições, ajudas e melhorias da comunidade são extremamente bem-vindas.

## Configuração do ambiente

Para quem deseja executar este projeto em sua própria máquina, é necessário:
- Ter o Node.js e o NPM instalados
- Instalar os pacotes requeridos em `package.json`
- Criar um arquivo `.env` com as credenciais necessárias (usar `.env_example` como base)
- Utilizar o script `npm start` ou semelhante para iniciar o projeto

Além disso é importante:
- Ter um token próprio para bot de Discord, vindo do próprio dashboard da plataforma (usado na variável de ambiente `BOT_TOKEN`)
- A variável de ambiente `TZ` serve para selecionar o timezone que será utilizado pelo Node.js
- Mudar os valores do arquivo `config.json` para atender aos canais, servidores e mensagens correspondentes ao seu caso de uso

## Desenvolvedores

- Marcus Natrielli - [@InfiniteMarcus](https://github.com/InfiniteMarcus)
