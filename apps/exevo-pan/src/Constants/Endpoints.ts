export const endpoints = {
  AUCTIONS: '/api/auctions',
  STATIC_DATA: process.env.NEXT_PUBLIC_STATIC_ENDPOINT as string,
  BLOG_QUERY: process.env.NEXT_PUBLIC_BLOG_ENDPOINT as string,
  BLOG_STATIC: process.env.NEXT_PUBLIC_BLOG_STATIC_ENDPOINT as string,
  BACKOFFICE_API: process.env.NEXT_PUBLIC_BACKOFFICE_ENDPOINT as string,
  WAR_DATA: 'https://exevo-pan-war-data.netlify.app',
  TIBIADATA: 'https://api.tibiadata.com/v2/characters',
  MAIL_CHECKOUT: '/api/mail-checkout',
  NEWSLETTER: '/api/mailchimp',
  ERROR_REPORT: '/api/error-report',
  FCM_SEND: 'https://fcm.googleapis.com/fcm/send',
}
