import { IMailConnection } from "../interfaces";
import Imap = require("imap");
import POP3Client = require("poplib");
import util = require('util');
import { simpleParser } from "mailparser";
const inspect = util.inspect;
export class MailService {

  /**
   * 
   * @param data 
   * @returns <Promise>
   * @description
   * Connect to imap or pop based on input
   * Send payload data received in request
   * 
   */
  connectToInbox(data) {
    if(data.serverType === 'imap') {
      return this.connectToImap(data);
    } else if(data.serverType === 'pop') {
      return this.connectToPop(data);
    }
  }

  private connectToImap(payload: IMailConnection) {
    return new Promise((resolve, reject) => {
      
      let imap = new Imap({
        user: payload.username,
        password: payload.password,
        host: payload.server,
        port: Number(payload.port),
        tls: payload.encryption === 'ssl',
        autotls: payload.encryption === 'starttls' ? 'always' : 'never',
        authTimeout: 20000,
        connTimeout: 100000,
        tlsOptions: {
          checkServerIdentity: () => undefined
        },
      });

      imap.on("error", (err: any) => {
        reject({ error: err, message: "Source server error" });
      });

      imap.once("ready", () => {
        getEmailFromInbox(imap);
      });

      imap.connect();
      let start: number = Number(payload.query.start) || 1;
      let limit: number = Number(payload.query.limit) ?? 9;

      limit = start + limit;
      let getEmailFromInbox = (mailServer: any) => {
        mailServer.openBox("INBOX", true,  (err: any, box: any) => {
          if (err) {
            reject({ error: err, message: "Failed to open inbox"});
          }
          if(limit > box.messages.total) {
            limit = box.messages.total;
          }
          let mailSeq = mailServer.seq.fetch(start + ':' + limit, {
            bodies: payload.fetchOptions,
            struct: true,
            envelop: true
          });

          let messagesArray: any[] = [];
          
          mailSeq.on("message",  (msg: any, seqno: any) => {
            msg.on("body", async (stream, info: any) => {
              await simpleParser(stream, {}, async (err, parsed: any) => {
                if(err) {
                  reject({ error: err, message: "Failed to parse emails"});
                }
                parsed.seqNo = seqno;
                await messagesArray.push(parsed);
              });
            });
          });

          mailSeq.once("error", (err: string) => {
            reject({ error: err, message: "No email found"});
          });
          
          mailSeq.once("end", () => {
            console.log("Done fetching all messages!");
            mailServer.end();
            setTimeout(() => {
              resolve({ messages: [...messagesArray], totalCount: box.messages.total, count: messagesArray.length });
            }, 3000);
          });
          
        });
      };

    });
  }
 
  private connectToPop(payload: IMailConnection) {
    return new Promise(async (resolve, reject) => {

      const port = Number(payload.port);
      const host = payload.server;
      let messagesArray: any[] = [];
      let msgsCount: Number;
      let totalCount: Number;
      let start: number = Number(payload.query.start) || 1;
      let limit: number = Number(payload.query.limit) ?? 9;

      const client = new POP3Client(port, host, {
        tlserrs: false,
        enabletls: payload.encryption === 'ssl',
      });

      client.on("error", (err) => {
        reject({ error: err, message: "Server error occurred"});
      });
      
      client.on("connect", () => {
        client.login(payload.username, payload.password);

      });
      
      client.on("invalid-state", (cmd) => {
        reject({ message: "Invalid state"});
      });

      client.on("login", (status, rawdata) => {
        if (status) {
            client.list();     
        } else {
          reject({ message: "Authentication failed"});
          client.quit();
        }
      });

      // Fetch all emails raw data
      client.on("list", async (status, msgcount, msgnumber, data, rawdata) => {
        if (status === false) {
            reject({ message: "Couldn't fetch the emails"});
            client.quit();
        } else {
          
            msgsCount = start + limit;
            totalCount = msgcount;
            if (msgcount > 0) {
              // Fetch emails sequentially
              let count = start;
              while(count <= msgcount) {
                await client.retr(count);
                count++;
              }
            } else
                client.quit();
        }
      });

      await client.on("retr", async (status, msgnumber, data, rawdata) => {
        if (status === true) {
            let parsed: any = await simpleParser(data);
            parsed.seqNo = msgnumber
            messagesArray.push(parsed);
            if(msgnumber === msgsCount)
              client.quit();
            else 
              client.retr(msgnumber + 1);
        } else {
            client.quit();
        }
      });

      client.on("quit", (status, rawdata) => {
        if (status === true) {
          console.log("Done fetching all messages!");
          setTimeout(() => {
            resolve({ messages: [...messagesArray], totalCount, count: messagesArray.length });
          }, 3000);
        }
        else 
          reject({ message: "Failed to quit process"});
      });
      
    })
  }

}
