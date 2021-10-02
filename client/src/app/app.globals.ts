export class Globals {
  readonly SERVER_TYPES = [{ 
    type: 'IMAP', 
    value: 'imap',
    encryptions: [
      { type: 'Unencrypted', value: 'unencrypted', port: 143 },
      { type: 'SSL/TLS', value: 'ssl', port: 993 },
      { type: 'STARTTLS', value: 'starttls', port: 143 }
    ]
  }, { 
    type: 'POP3', 
    value: 'pop',
    encryptions: [
      { type: 'Unencrypted', value: 'unencrypted', port: 110 },
      { type: 'SSL/TLS', value: 'ssl', port: 995 },
      { type: 'STARTTLS', value: 'starttls', port: 110 }
    ]
  }]
}