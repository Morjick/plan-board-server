
import { OKResponse, ServerErrorResponse } from '~/data/constants/Responses'
import { createRegistrationEmailTemplate } from '~/data/templates/email.templates'
import nodemailer from 'nodemailer'

export interface ISendMailData {
  subject: string
  text: string
  html: string
  to: string
}

export interface ISendVerificationCode {
  to: string
  verificationCode: number
  username: string
}

const mailer = nodemailer.createTransport({
  host: 'smtp.yandex.ru',
  port: 587,
  secure: false,
  auth: {
    user: 'planboard@yandex.ru',
    pass: 'hdyhednomxrsauwc'
  },
})

export class Mailer {
  public static async sendMail (data: ISendMailData) {
    try {
      await mailer.sendMail({
        from: 'PlanBoard <planboard@yandex.ru>',
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data.html,
      })

      return OKResponse
    } catch (e) {
      return ServerErrorResponse
    }
  }

  public static async sendVerificationCode (data: ISendVerificationCode) {
    const template = createRegistrationEmailTemplate({ username: data.username, verificationCode: data.verificationCode })

    return await Mailer.sendMail({
      to: data.to,
      subject: 'Добро пожаловать в PlanBoard!',
      text: 'Закончите регистрацию в PlanBoard!',
      html: template,
    })
  }
}
