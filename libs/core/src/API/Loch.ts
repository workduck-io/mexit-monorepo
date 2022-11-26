import { AxiosX } from './AxiosX'

export class LochAPI {
  private client: AxiosX
  constructor(client: AxiosX) {
    this.client = client
  }
}
