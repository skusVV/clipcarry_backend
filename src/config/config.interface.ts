export interface IConfigs {
  port: number;
  mongoURI: string;
  stripeSecret: string;
  agendaCollection: string;

  token: {
    key: string;
    expTime: string;
    defaultExpTime: string;
  };

  guestUserPassword: string;
  registrationPromoCode: string;
}