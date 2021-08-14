export interface IMailConnection {
  serverType: string,
  server: string,
  port: string,
  encryption: string,
  username: string,
  password: string,
  fetchOptions: string,
  query: {
    start?: number,
    limit?: number,
  },
}