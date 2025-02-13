import { fromTraffic } from '@mswjs/source/traffic'
import traffic from './h2ogestion.cl.json'
 
export const handlers = [...fromTraffic(traffic as never)]