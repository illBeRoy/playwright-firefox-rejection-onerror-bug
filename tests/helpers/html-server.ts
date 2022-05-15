import express from 'express';
import waitOn from 'wait-on';
import { Server } from 'http';
import assert from 'assert';

export class HtmlServer {
  private html = ''
  private server: Server | null;
  private url: string | null;

  async start({ port = 4731 } = {}) {
    assert(!this.server && !this.url, 'server already started')

    const app = express();
    app.get('/', (req, res) => res.send(this.html));
    this.url = `http://localhost:${port}/`;
    this.server = app.listen(port);
    await waitOn({resources:[ this.url ]})
  }

  stop() {
    assert(this.server && this.url, 'server not started');
    this.url = null;
    this.server.close();
  }

  given = {
    pageHtml: (html: string) => {
      this.html = html;
    }
  }

  get = {
    url: () => this.url
  }
}
