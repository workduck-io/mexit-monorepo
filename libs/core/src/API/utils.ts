import { AxiosResponse } from 'axios'

export const getData = (item: AxiosResponse) => item?.data as any
