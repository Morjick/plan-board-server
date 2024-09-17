
export interface IRegistrationTemplate {
  verificationCode: number
  username: string
}

export const createRegistrationEmailTemplate = (data: IRegistrationTemplate) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet">
      <title>Добро пожаловать в PlanBoard!</title>
      <style>
        * {font-family: "Ubuntu", sans-serif;box-sizing: border-box;color: #202C39}
        body {background: #E1E1E1;}
        h1 {color: #F5F5F5;font-size: 28px}
        .container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center
        }
        .container-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-image {
          height: 40px;
        }

        .logo-title {
          color: #355EFF;
          font-size: 32px;
          font-weight: bold;
        }

        .wrapper {
          max-width: 640px;
          min-width: 500px;

          margin: 20px auto;
          border-radius: 5px;
          background: #F5F5F5;
          overflow: hidden;
        }

        .wrapper-header {
          padding: 10px;

          background: #5A7BFF;
          text-align: left;
        }

        .wrapper-body {
          padding: 10px;

          text-align: left;
          overflow: hidden;
        }

        .container-error {
          max-width: 640px;
        }

        .container-error-text {
          text-align: right;
          color: #47525B;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="container-logo">      
          <img class="logo-image" src="data:image/png;base64,  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" alt="">
        </div>
        <div class="wrapper">
          <div class="wrapper-header">
            <h1>Добро пожаловать в PlanBoard!</h1>
          </div>
          <div class="wrapper-body">
            <p>Здравствуйте, ${data.username}</p>
            <p>Мы рады приветствовать Вас, и мы еще больше рады тому, что запланировали. Вы уже на пути к созданию красивых визуальных продуктов. Если вы здесь ради своего бренда, по какой-то причине или просто ради развлечения, добро пожаловать! Если вам что-то понадобится, мы будем рядом на каждом шагу.</p>
            <p>Ваш верификационный код: <span style="font-weight: bold;">${data.verificationCode}</span></p>
            <p>Спасибо, увидимся в <span style="color: #355EFF; font-weight: bold;">PlanBoard</span>!</p>
          </div>
        </div>
        <div class="container-error">
          <p class="container-error-text">Если вы не указывали для регистрацию эту почту, пожалуйста, проигнорируйте это письмо или напишите нам на почту <span style="color: #355EFF;">planboard@yandex.ru</span></p>
        </div>
      </div>
    </body>
    </html>
  `
}

export const createForgetPasswordEmailTemplate = (data: IRegistrationTemplate) => {
  return `
    <!DOCTYPE html>
    <html lang="en">

    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link
        href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap"
        rel="stylesheet">
      <title>Восстановления пароля в PlanBoard</title>
      <style>
        * {
          font-family: "Ubuntu", sans-serif;
          box-sizing: border-box;
          color: #202C39
        }

        body {
          background: #E1E1E1;
        }

        h1 {
          color: #F5F5F5;
          font-size: 28px
        }

        .container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center
        }

        .container-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-image {
          height: 40px;
        }

        .logo-title {
          color: #355EFF;
          font-size: 32px;
          font-weight: bold;
        }

        .wrapper {
          max-width: 640px;
          min-width: 500px;

          margin: 20px auto;
          border-radius: 5px;
          background: #F5F5F5;
          overflow: hidden;
        }

        .wrapper-header {
          padding: 10px;

          background: #5A7BFF;
          text-align: left;
        }

        .wrapper-body {
          padding: 10px;

          text-align: left;
          overflow: hidden;
        }

        .container-error {
          max-width: 640px;
        }

        .container-error-text {
          text-align: right;
          color: #47525B;
        }
      </style>
    </head>

    <body>
      <div class="container">
        <div class="container-logo">
          <img class="logo-image"
            src="data:image/png;base64,  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"
            alt="">
        </div>
        <div class="wrapper">
          <div class="wrapper-header">
            <h1>Восстановаление пароля в PlanBoard!</h1>
          </div>
          <div class="wrapper-body">
            <p>Здравствуйте, ${data.username}</p>
            <p>С вашего аккаунта была запущена процедура восстановления пароля. Для того, чтобы установить новый пароль,
              необходимо ввести код (указан ниже) в соотвествующей форме браузера</p>
            <p>Код для восстановления пароля: <span style="font-weight: bold;">${data.verificationCode}</span></p>
            <p>Спасибо, увидимся в <span style="color: #355EFF; font-weight: bold;">PlanBoard</span>!</p>
          </div>
        </div>
        <div class="container-error">
          <p class="container-error-text">Если вы не нажимали на "забыл пароль", пожалуйста, проигнорируйте это письмо или
            напишите нам на почту <span style="color: #355EFF;">planboard@yandex.ru</span></p>
        </div>
      </div>
    </body>

    </html>
  `
}
