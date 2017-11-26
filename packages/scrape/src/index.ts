import { launch } from 'puppeteer'
import browserify from 'browserify'
import { Node } from '@endal/dom'
import { Context } from '@endal/rule'
import * as Pickle from '@endal/pickle'

const PICKLE = require.resolve('@endal/pickle')

const { parentize } = Pickle

function bundle (file: string, options: object): Promise<string> {
  return new Promise((resolve, reject) =>
    browserify(file, options).bundle((error, buffer) => {
      if (error) {
        reject(error)
      } else {
        resolve(buffer.toString('utf8'))
      }
    })
  )
}

export enum Wait {
  Ready = 'domcontentloaded',
  Loaded = 'load',
  Idle = 'networkidle0'
}

export interface ScrapeOptions {
  timeout: number
  wait: Wait
}

export class Scraper {
  private readonly _browser = launch({
    headless: true
  })

  private readonly _pickle = bundle(PICKLE, {
    standalone: 'Endal.Pickle'
  })

  async scrape (url: string, options: Partial<ScrapeOptions> = {}): Promise<Context> {
    const browser = await this._browser
    const pickle = await this._pickle

    const page = await browser.newPage()
    await page.goto(url, {
      timeout: options.timeout || 10000,
      waitUntil: options.wait || Wait.Loaded
    })

    await page.evaluate(pickle)

    const Endal = { Pickle }

    const virtual = await page.evaluate(() => {
      const dom = Endal.Pickle.virtualize(document, { parents: false })

      const style = Endal.Pickle.style(dom).values()
      const layout = Endal.Pickle.layout(dom).values()

      Endal.Pickle.dereference(dom)

      return { dom, style: [...style], layout: [...layout] }
    })

    await page.close()

    return {
      dom: virtual.dom,
      style: {
        default: virtual.style
      }
    }
  }

  async close (): Promise<void> {
    const browser = await this._browser
    await browser.close()
  }
}

const scraper = new Scraper()

scraper.scrape('https://siteimprove.com').then(ctx => console.log(ctx))
