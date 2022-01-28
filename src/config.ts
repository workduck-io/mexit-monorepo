export default {
  cognito: {
    REGION: 'us-east-1',
    USER_POOL_ID: 'us-east-1_Zu7FAh7hj',
    APP_CLIENT_ID: '6pvqt64p0l2kqkk2qafgdh13qe',
    IDENTITY_POOL_ID: 'us-east-1:315a075f-0427-46bc-9d82-e08133591944'
  },
  mixpanel: {
    TOKEN: process.env.MIXPANEL_TOKEN
  }
}

export const BROWSER_EXTENSION_CUSTOM_ATTRIBUTES = [{ name: 'user_type', value: 'browser_extension' }]
