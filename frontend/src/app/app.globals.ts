export class Globals {
  readonly SERVERTYPES = [
    { type: 'IMAP', value: 'imap' },
    { type: 'POP3', value: 'pop' },
  ]

  readonly ENCRYPTIONS = [
    { type: 'Unencrypted', value: 'unencrypted' },
    { type: 'SSL/TLS', value: 'ssl' },
    { type: 'STARTTLS', value: 'starttls' }
  ]
}