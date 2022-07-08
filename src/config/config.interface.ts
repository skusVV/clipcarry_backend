export interface IConfigs {
  port: number;
  mongoURI: string;
  stripeSecret: string;
  stripeProductPrice: string;

  token: {
    key: string;
    expTime: string;
    defaultExpTime: string;
  };

  guestUserPassword: string;
  registrationPromoCode: string;
  landingUrl: string;
}